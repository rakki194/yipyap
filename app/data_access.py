import logging
import hashlib
import threading
import sqlite3
import json
from io import BytesIO
from collections import defaultdict
from pathlib import Path
from stat import S_ISDIR, S_ISREG
from typing import Dict, Optional, List, Tuple
from datetime import datetime, timezone
import asyncio
import aiofiles
from natsort import os_sort_keygen as natsort_keygen
import magic

import pillow_jxl


from .drhead_loader import open_srgb
from .models import ImageModel, DirectoryModel, BrowseHeader


logger = logging.getLogger("uvicorn.error")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".jxl"}


class ImageDataSource:
    """Abstract interface for image data access"""

    async def get_image_info(self, path: Path) -> ImageModel:
        raise NotImplementedError

    async def get_caption(self, path: Path) -> str:
        raise NotImplementedError

    async def save_caption(self, path: Path, caption: str) -> None:
        raise NotImplementedError

    async def ensure_thumbnail(self, path: Path) -> Path:
        raise NotImplementedError

    async def scan_directory(
        self,
        directory: Path,
        search: Optional[str] = None,
        sort_by: str = "name",
        page: int = 1,
        page_size: int = 50,
    ) -> Dict:
        raise NotImplementedError

    def is_image_file(self, path: Path) -> bool:
        """Check if file is an allowed image type"""
        return path.suffix.lower() in self.ALLOWED_EXTENSIONS

    async def get_basic_info(self, path: Path) -> Dict:
        """Get basic file info without loading the image"""
        stat = path.stat()
        return {
            "type": "image" if self.is_image_file(path) else "directory",
            "name": path.name,
            "path": str(path.relative_to(self.root_dir)),
            "modified": stat.st_mtime,
            "size": stat.st_size,
        }


class CachedFileSystemDataSource(ImageDataSource):
    def __init__(
        self,
        root_dir: Path,
        thumbnail_size: tuple[int, int],
        preview_size: tuple[int, int],
        db_path: str = "cache.db",
    ):
        self.root_dir = root_dir
        self.thumbnail_size = thumbnail_size
        self.preview_size = preview_size
        self.db_path = db_path
        self.db_connnections = {}
        self._init_db()
        self.directory_cache = {}

    def _init_db(self):
        logger.info(f"Initializing database at {self.db_path}")
        conn = self._get_connection()
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS image_info (
                directory TEXT NOT NULL,
                name TEXT NOT NULL,
                info JSON NOT NULL,
                cache_time INTEGER NOT NULL,
                thumbnail_webp BLOB NOT NULL,
                PRIMARY KEY (directory, name)
            )
            """
        )
        conn.commit()

    def _get_connection(self):
        thread_id = threading.get_ident()
        conn = self.db_connnections.get(thread_id)
        if conn is None:
            self.db_connnections[thread_id] = conn = sqlite3.connect(self.db_path)
            conn.execute("PRAGMA busy_timeout = 30000")
        return conn

    def _compute_md5(self, path: Path) -> str:
        """Compute MD5 hash of file"""
        md5 = hashlib.md5()
        with open(path, "rb") as f:
            while chunk := f.read(8192):
                md5.update(chunk)
        return md5.hexdigest()

    async def get_thumbnail(self, path: str) -> Optional[bytes]:
        """Get thumbnail webp data from cache"""
        conn = self._get_connection()
        result = conn.execute(
            "SELECT thumbnail_webp FROM image_info WHERE directory = ? AND name LIKE ?",
            (str(path.parent), path.name.replace(".webp", "%")),
        ).fetchone()
        return result[0] if result else None

    def get_image_info(self, directory: Path, item: Dict) -> ImageModel:
        """Get image info with caching"""
        path = directory / item["name"]
        logger.debug(f"Getting image info with caching for {path}")

        conn = self._get_connection()
        result = conn.execute(
            "SELECT info, cache_time FROM image_info WHERE directory = ? AND name = ?",
            (str(directory), item["name"]),
        ).fetchone()

        current_mtime = item["mtime"]

        if result:
            cache_mtime = datetime.fromtimestamp(result[1], tz=timezone.utc)
            if cache_mtime >= current_mtime:
                return ImageModel.model_validate_json(result[0])

        # Cache miss - generate new info
        md5sum = self._compute_md5(path)

        # Get captions:
        captions = []
        for ext, caption_name in item["captions"].items():
            caption_path = directory / caption_name
            with open(caption_path, "r") as f:
                caption = f.read()
            assert ext[0] == "."
            captions.append((ext[1:], caption))

        # Generate thumbnail in memory
        with open_srgb(path, force_load=False) as img:
            width, height = img.size

            # Create thumbnail
            img.thumbnail(self.thumbnail_size)

            thumbnail_buffer = BytesIO()
            img.save(thumbnail_buffer, format="WebP", quality=80)
            thumbnail_data = thumbnail_buffer.getvalue()

        info = ImageModel(
            name=path.name,
            mtime=item["mtime"],
            size=item["size"],
            md5sum=md5sum,
            mime=magic.from_file(str(path), mime=True),
            width=width,
            height=height,
            captions=captions,
        )

        # Cache image info and thumbnail
        conn.execute(
            """
            INSERT OR REPLACE INTO image_info 
            (directory, name, info, cache_time, thumbnail_webp) 
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                str(directory),
                path.name,
                info.model_dump_json(),
                int(datetime.now(timezone.utc).timestamp()),
                thumbnail_data,
            ),
        )
        conn.commit()

        return info

    def _scan_directory(
        self,
        directory: Path,
    ) -> List[DirectoryModel | Dict]:
        dir_entries = list()
        img_entries = list()
        mtimes = dict()
        all_side_car_files = defaultdict(dict)
        for entry in directory.iterdir():
            name = entry.name
            if name.startswith("."):
                continue
            stat = entry.stat()
            st_mode = stat.st_mode

            if S_ISDIR(st_mode):
                dir_entries.append(
                    DirectoryModel(
                        name=name,
                        mtime=datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc),
                    )
                )
            elif S_ISREG(st_mode):
                suffix = entry.suffix.lower()
                if suffix in IMAGE_EXTENSIONS:
                    stem = entry.stem
                    img_entries.append(
                        {
                            "name": name,
                            "stem": stem,
                            "type": "image",
                            "size": stat.st_size,
                        }
                    )
                    mtimes[stem] = max(stat.st_mtime, mtimes.get(stem, 0))
                elif suffix in {".caption", ".txt", ".tags"}:
                    stem = entry.stem
                    all_side_car_files[stem][suffix] = name
                    mtimes[stem] = max(stat.st_mtime, mtimes.get(stem, 0))
                    continue
                else:
                    continue
            else:
                continue

        for entry in img_entries:
            side_car_files = all_side_car_files.get(entry["stem"], {})
            entry["captions"] = side_car_files
            entry["mtime"] = datetime.fromtimestamp(
                mtimes[entry["stem"]], tz=timezone.utc
            )

        dir_entries.sort(key=natsort_keygen(lambda x: x.name))
        img_entries.sort(key=natsort_keygen(lambda x: x["name"]))
        return dir_entries, img_entries

    def scan_directory(
        self,
        directory: Path,
    ) -> Tuple[float, List[DirectoryModel], List[Dict]]:
        directory_mtime = directory.stat().st_mtime
        items = None
        from_cache = self.directory_cache.get(directory)
        if from_cache is not None:
            from_cache, cache_mtime = from_cache
            if directory_mtime <= cache_mtime:
                items = from_cache
        if items is None:
            items = list(self._scan_directory(directory))
            self.directory_cache[directory] = (items, directory_mtime)

        return directory_mtime, *items

    def analyze_dir(
        self,
        directory: Path,
        page: int = 1,
        page_size: int = 50,
        http_head: bool = False,
        if_modified_since: Optional[datetime] = None,
    ) -> Tuple[BrowseHeader, Optional[List[Dict]], Optional[List[asyncio.Future]]]:
        # For HEAD requests, we need total items but don't need to process them
        directory_mtime, dir_items, img_items = self.scan_directory(directory)
        mtime_dt = datetime.fromtimestamp(directory_mtime, tz=timezone.utc)
        total = len(img_items) + len(dir_items)

        # Apply pagination to items:
        start = (page - 1) * page_size
        end = start + page_size

        dir_count = len(dir_items)

        # Calculate how many items to take from each list
        if start < dir_count:
            # Start is in directory items
            dir_start = start
            dir_end = min(end, dir_count)
            img_start = 0
            img_end = end - dir_count if end > dir_count else 0
        else:
            # Start is in image items
            dir_start = dir_end = 0
            img_start = start - dir_count
            img_end = end - dir_count

        dir_names = [d.name for d in dir_items]
        img_names = [i["name"] for i in img_items]
        assert (dir_names + img_names)[start:end] == dir_names[
            dir_start:dir_end
        ] + img_names[img_start:img_end]

        dir_items = dir_items[dir_start:dir_end]
        img_items = img_items[img_start:img_end]

        # Gets names and update mtime
        folder_names = [f.name for f in dir_items]
        image_names = []
        for item in img_items:
            mtime_dt = max(mtime_dt, item["mtime"])
            image_names.append(item["name"])

        browser_header = BrowseHeader(
            mtime=mtime_dt,
            page=page,
            pages=(total + page_size - 1) // page_size,
            folders=folder_names,
            images=image_names,
            total_items=total,
        )

        if http_head or (
            if_modified_since and mtime_dt.replace(microsecond=0) <= if_modified_since
        ):
            return browser_header, None, None

        loop = asyncio.get_event_loop()
        run = loop.run_in_executor

        image_info_futures = [
            run(None, self.get_image_info, directory, item) for item in img_items
        ]

        return browser_header, dir_items, image_info_futures

    async def save_caption(self, path: Path, caption: str, caption_type: str) -> None:
        """Save image caption to file and update cache"""
        try:
            # Construct caption file path by replacing image extension with .{caption_type}
            caption_path = path.with_suffix(f".{caption_type}")

            # Save to file
            async with aiofiles.open(caption_path, "w") as f:
                await f.write(caption)
            logger.info(f"Saved caption to {caption_path}")

            # Update cache
            directory = path.parent
            name = path.name  # Original image name with extension

            conn = self._get_connection()
            result = conn.execute(
                "SELECT info FROM image_info WHERE directory = ? AND name = ?",
                (str(directory), name),
            ).fetchone()

            if result:
                info = ImageModel.model_validate_json(result[0])
                # Update the caption in the cached info
                new_captions = [
                    (t, c) if t != caption_type else (t, caption)
                    for t, c in info.captions
                ]
                info.captions = new_captions

                # Update cache
                conn.execute(
                    """
                    UPDATE image_info 
                    SET info = ?, cache_time = ?
                    WHERE directory = ? AND name = ?
                    """,
                    (
                        info.model_dump_json(),
                        int(datetime.now(timezone.utc).timestamp()),
                        str(directory),
                        name,
                    ),
                )
                conn.commit()

        except Exception as e:
            logger.error(f"Error saving caption for {path}: {e}")
            raise

    async def get_preview(self, path: Path) -> bytes:
        """Generate preview image (larger than thumbnail, smaller than original)"""
        directory = path.parent
        _, _, items = self.scan_directory(directory)
        stem = path.stem
        for item in items:
            if item["stem"] == stem:
                path = directory / item["name"]
                break
        else:
            return None
        try:
            with open_srgb(path) as img:
                img.thumbnail(self.preview_size)
                output = BytesIO()
                img.save(output, format="WebP", quality=70, method=6)
                output.seek(0)

            return output.getvalue()
        except Exception as e:
            logger.exception(f"Error generating preview for {path}: {e}")
            raise

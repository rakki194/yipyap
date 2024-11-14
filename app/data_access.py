from pathlib import Path
from typing import Dict, Optional, List, Literal
from dataclasses import dataclass
import magic
from PIL import Image
import shutil
import logging

from pydantic import BaseModel
from . import utils
from .drhead_loader import open_srgb
import hashlib
import aiofiles
import sqlite3
import json
from datetime import datetime, timedelta
from functools import lru_cache
import asyncio
from contextlib import asynccontextmanager
from io import BytesIO

import pillow_jxl

from .models import ImageModel, DirectoryModel


logger = logging.getLogger("uvicorn.error")


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

    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".jxl"}

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
        self._init_db()

    def _init_db(self):
        logger.info(f"Initializing database at {self.db_path}")
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS image_info (
                    path TEXT PRIMARY KEY,
                    md5sum TEXT NOT NULL,
                    info JSON NOT NULL,
                    thumbnail_webp BLOB NOT NULL,
                    last_modified REAL NOT NULL,
                    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS directory_cache (
                    path TEXT PRIMARY KEY,
                    entries JSON NOT NULL,
                    last_modified REAL NOT NULL,
                    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """
            )
            conn.commit()

    @asynccontextmanager
    async def _db_connection(self):
        conn = sqlite3.connect(self.db_path)
        try:
            yield conn
        finally:
            conn.close()

    async def _compute_md5(self, path: Path) -> str:
        """Compute MD5 hash of file"""
        md5 = hashlib.md5()
        async with aiofiles.open(path, "rb") as f:
            while chunk := await f.read(8192):
                md5.update(chunk)
        return md5.hexdigest()

    async def get_thumbnail(self, path: str) -> Optional[bytes]:
        """Get thumbnail webp data from cache"""
        async with self._db_connection() as conn:
            result = conn.execute(
                "SELECT thumbnail_webp FROM image_info WHERE path LIKE ?",
                (str(path).replace(".webp", "%"),),
            ).fetchone()
            return result[0] if result else None

    async def get_image_info(self, path: Path) -> ImageModel:
        """Get image info with caching"""
        logger.debug(f"Getting image info with caching for {path}")
        async with self._db_connection() as conn:
            result = conn.execute(
                "SELECT info, thumbnail_webp, md5sum, last_modified FROM image_info WHERE path = ?",
                (str(path),),
            ).fetchone()

            current_mtime = path.stat().st_mtime

            if result and result[3] == current_mtime:
                # Cache hit
                info_dict = json.loads(result[0])
                return ImageModel(**info_dict)

            # Cache miss - generate new info
            md5sum = await self._compute_md5(path)

            # Generate thumbnail in memory
            with open_srgb(path, force_load=False) as img:
                width, height = img.size
                aspect_ratio = width / height

                # Create thumbnail
                img.thumbnail(self.thumbnail_size)
                thumbnail_width, thumbnail_height = img.size

                thumbnail_buffer = BytesIO()
                img.save(thumbnail_buffer, format="WebP", quality=80)
                thumbnail_data = thumbnail_buffer.getvalue()

            # Create thumbnail URL
            thumbnail_url = f"/thumbnail/{str(path.relative_to(self.root_dir))}"
            info = ImageModel(
                name=path.name,
                path=str(path.relative_to(self.root_dir)),
                size=path.stat().st_size,
                modified=current_mtime,
                mime=magic.from_file(str(path), mime=True),
                width=width,
                height=height,
                aspect_ratio=aspect_ratio,
                thumbnail_width=thumbnail_width,
                thumbnail_height=thumbnail_height,
                thumbnail_url=thumbnail_url,
            )

            # Cache everything
            conn.execute(
                """
                INSERT OR REPLACE INTO image_info 
                (path, md5sum, info, thumbnail_webp, last_modified) 
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    str(path),
                    md5sum,
                    json.dumps(info.__dict__),
                    thumbnail_data,
                    current_mtime,
                ),
            )
            conn.commit()

            return info

    async def scan_directory(
        self,
        directory: Path,
        search: Optional[str] = None,
        sort_by: str = "name",
        page: int = 1,
        page_size: int = 50,
    ) -> Dict:
        """Scan directory with caching - only basic file info"""
        logger.debug(f"Scanning directory with caching: {directory}")

        items = []
        image_tasks = []

        for entry in directory.iterdir():
            if entry.is_dir():
                items.append(
                    DirectoryModel(
                        name=entry.name,
                        path=str(entry.relative_to(self.root_dir)),
                        type="directory",
                    ).model_dump()
                )
            elif entry.suffix.lower() in {".jpg", ".jpeg", ".png", ".gif", ".jxl"}:
                image_tasks.append(self.get_image_info(entry))

        # Process all images in parallel
        if image_tasks:
            image_results = await asyncio.gather(*image_tasks, return_exceptions=True)
            for result in image_results:
                if not isinstance(result, Exception):
                    items.append(result.model_dump())
                else:
                    logger.error(f"Error processing image: {result}")

        # Apply search filter if needed
        if search:
            search = search.lower()
            items = [item for item in items if search in item["name"].lower()]

        # Pagination
        total = len(items)
        start = (page - 1) * page_size
        end = start + page_size

        return {
            "items": items[start:end],
            "total": total,
            "page": page,
            "pages": (total + page_size - 1) // page_size,
        }

    def _paginate_results(self, items: List[Dict], page: int, page_size: int) -> Dict:
        total = len(items)
        start = (page - 1) * page_size
        end = start + page_size

        return {
            "items": items[start:end],
            "total": total,
            "page": page,
            "pages": (total + page_size - 1) // page_size,
        }

    async def get_caption(self, path: Path) -> str:
        """Get image caption from .caption file"""
        caption_path = path.with_suffix(".caption")
        if not caption_path.exists():
            return ""

        async with aiofiles.open(caption_path, "r") as f:
            return await f.read()

    async def save_caption(self, path: Path, caption: str) -> None:
        """Save image caption to .caption file"""
        async with aiofiles.open(path, "w") as f:
            await f.write(caption)

    async def get_preview(self, path: Path) -> bytes:
        """Generate preview image (larger than thumbnail, smaller than original)"""
        try:
            with open_srgb(path) as img:
                img.thumbnail(self.preview_size)
                output = BytesIO()
                img.save(output, format="WebP", quality=85, method=6)
                output.seek(0)

            return output.getvalue()
        except Exception as e:
            logger.exception(f"Error generating preview for {path}: {e}")
            raise

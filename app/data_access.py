from pathlib import Path
from typing import Dict, Optional, List
from dataclasses import dataclass
import magic
from PIL import Image
import shutil
import logging
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

logger = logging.getLogger('uvicorn.error')

@dataclass
class ImageInfo:
    name: str
    path: Path
    thumbnail_url: str  # URL path for thumbnail endpoint
    size: int
    modified: float
    mime: str
    width: int
    height: int
    aspect_ratio: float
    thumbnail_width: float
    thumbnail_height: float
    type: str = 'image'


class ImageDataSource:
    """Abstract interface for image data access"""
    async def get_image_info(self, path: Path) -> ImageInfo:
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
        page_size: int = 50
    ) -> Dict:
        raise NotImplementedError

    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.jxl'}
    
    def is_image_file(self, path: Path) -> bool:
        """Check if file is an allowed image type"""
        return path.suffix.lower() in self.ALLOWED_EXTENSIONS

    async def get_basic_info(self, path: Path) -> Dict:
        """Get basic file info without loading the image"""
        stat = path.stat()
        return {
            'type': 'image' if self.is_image_file(path) else 'directory',
            'name': path.name,
            'path': str(path.relative_to(self.root_dir)),
            'modified': stat.st_mtime,
            'size': stat.st_size
        }


class FileSystemDataSource(ImageDataSource):
    def __init__(self, root_dir: Path, thumbnail_size: tuple[int, int]):
        self.root_dir = root_dir
        self.thumbnail_size = thumbnail_size
        self.thumbnail_dir = Path("static/thumbnails")
        self.thumbnail_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Initialized FileSystemDataSource with root_dir: {root_dir}")

    async def ensure_thumbnail(self, path: Path) -> Path:
        """Generate thumbnail if it doesn't exist"""
        thumbnail_path = self.thumbnail_dir / f"{path.stem}_{self.thumbnail_size[0]}x{self.thumbnail_size[1]}{path.suffix}"
        
        if not thumbnail_path.exists() or thumbnail_path.stat().st_mtime < path.stat().st_mtime:
            logger.debug(f"Generating thumbnail for {path}")
            with open_srgb(path) as img:
                img.thumbnail(self.thumbnail_size)
                img.save(thumbnail_path)
                
        return thumbnail_path

    async def get_image_info(self, path: Path) -> ImageInfo:
        """Get information about a single image"""
        logger.debug(f"Fetching image info for {path}")
        if not path.is_file():
            logger.error(f"Image not found: {path}")
            raise FileNotFoundError(f"Image not found: {path}")
            
        thumbnail_path = await self.ensure_thumbnail(path)
        this_doesn_runs_right()
        
        with open_srgb(path, force_load=False) as img:
            width, height = img.size
            aspect_ratio = width / height
            
        logger.debug(f"Image info retrieved for {path}: width={width}, height={height}, aspect_ratio={aspect_ratio}")
        
        return ImageInfo(
            name=path.name,
            path=str(path.relative_to(self.root_dir)),
            thumbnail=str(thumbnail_path.relative_to(Path("static"))),
            size=path.stat().st_size,
            modified=path.stat().st_mtime,
            mime=magic.from_file(str(path), mime=True),
            width=width,
            height=height,
            aspect_ratio=aspect_ratio,
            thumbnail_width=self.thumbnail_size[0] if aspect_ratio <= 1 else self.thumbnail_size[0] * aspect_ratio,
            thumbnail_height=self.thumbnail_size[1] if aspect_ratio > 1 else self.thumbnail_size[1] / aspect_ratio
        )

    async def get_caption(self, path: Path) -> str:
        """Get image caption from .caption file"""
        caption_path = path.with_suffix('.caption')
        if not caption_path.exists():
            return ""
            
        async with aiofiles.open(caption_path, 'r') as f:
            return await f.read()

    async def save_caption(self, path: Path, caption: str) -> None:
        """Save image caption to .caption file"""
        async with aiofiles.open(path, 'w') as f:
            await f.write(caption)

    async def scan_directory(
        self,
        directory: Path,
        search: Optional[str] = None,
        sort_by: str = "name",
        page: int = 1,
        page_size: int = 50
    ) -> Dict:
        """Scan directory with filtering and pagination"""
        logger.debug(f"Scanning directory: {directory}, search: {search}, sort_by: {sort_by}, page: {page}, page_size: {page_size}")
        items = []
        
        for entry in directory.iterdir():
            if entry.is_dir():
                items.append({
                    'type': 'directory',
                    'name': entry.name,
                    'path': str(entry.relative_to(self.root_dir))
                })
            elif entry.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.jxl'}:
                try:
                    image_info = await self.get_image_info(entry)
                    items.append(image_info.__dict__)
                except Exception as e:
                    logger.exception(f"Error processing {entry}: {e}")
                    continue

        total_images = sum(1 for item in items if item['type'] == 'image')
        total_directories = sum(1 for item in items if item['type'] == 'directory')
        logger.debug(f"Total images found: {total_images}, Total directories found: {total_directories}")

        # Apply search filter
        if search:
            search = search.lower()
            items = [item for item in items if search in item['name'].lower()]

        # Apply sorting
        if sort_by == "name":
            items.sort(key=lambda x: x['name'].lower())
        elif sort_by == "date":
            items.sort(key=lambda x: x.get('modified', 0), reverse=True)
        elif sort_by == "size":
            items.sort(key=lambda x: x.get('size', 0), reverse=True)

        # Apply pagination
        total = len(items)
        start = (page - 1) * page_size
        end = start + page_size
        
        return {
            'items': items[start:end],
            'total': total,
            'page': page,
            'pages': (total + page_size - 1) // page_size
        }

    async def _compute_md5(self, path: Path) -> str:
        hash_md5 = hashlib.md5()
        async with aiofiles.open(path, "rb") as f:
            while True:
                chunk = await f.read(4096)
                if not chunk:
                    break
                hash_md5.update(chunk)
        return hash_md5.hexdigest()


class CachedFileSystemDataSource(FileSystemDataSource):
    def __init__(self, root_dir: Path, thumbnail_size: tuple[int, int], db_path: str = "cache.db"):
        self.root_dir = root_dir
        self.thumbnail_size = thumbnail_size
        self.db_path = db_path
        self._init_db()
        
    def _init_db(self):
        logger.info(f"Initializing database at {self.db_path}")
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS image_info (
                    path TEXT PRIMARY KEY,
                    md5sum TEXT NOT NULL,
                    info JSON NOT NULL,
                    thumbnail_webp BLOB NOT NULL,
                    last_modified REAL NOT NULL,
                    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS directory_cache (
                    path TEXT PRIMARY KEY,
                    entries JSON NOT NULL,
                    last_modified REAL NOT NULL,
                    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
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
        async with aiofiles.open(path, 'rb') as f:
            while chunk := await f.read(8192):
                md5.update(chunk)
        return md5.hexdigest()

    async def get_thumbnail(self, path: str) -> Optional[bytes]:
        """Get thumbnail webp data from cache"""
        async with self._db_connection() as conn:
            result = conn.execute(
                "SELECT thumbnail_webp FROM image_info WHERE path LIKE ?",
                (path.replace('.webp', '%'),)
            ).fetchone()
            return result[0] if result else None

    async def get_image_info(self, path: Path) -> ImageInfo:
        """Get image info with caching"""
        logger.debug(f"Getting image info with caching for {path}")
        async with self._db_connection() as conn:
            result = conn.execute(
                "SELECT info, thumbnail_webp, md5sum, last_modified FROM image_info WHERE path = ?",
                (str(path),)
            ).fetchone()
            
            current_mtime = path.stat().st_mtime
            
            if result and result[3] == current_mtime:
                # Cache hit
                info_dict = json.loads(result[0])
                return ImageInfo(**info_dict)

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
                img.save(thumbnail_buffer, format='WebP', quality=80)
                thumbnail_data = thumbnail_buffer.getvalue()

            # Create thumbnail URL
            thumbnail_url = f"/thumbnail/{str(path.relative_to(self.root_dir))}"
            info = ImageInfo(
                name=path.name,
                path=str(path.relative_to(self.root_dir)),
                thumbnail_url=thumbnail_url,
                size=path.stat().st_size,
                modified=current_mtime,
                mime=magic.from_file(str(path), mime=True),
                width=width,
                height=height,
                aspect_ratio=aspect_ratio,
                thumbnail_width=thumbnail_width,
                thumbnail_height=thumbnail_height
            )

            # Cache everything
            conn.execute(
                """
                INSERT OR REPLACE INTO image_info 
                (path, md5sum, info, thumbnail_webp, last_modified) 
                VALUES (?, ?, ?, ?, ?)
                """,
                (str(path), md5sum, json.dumps(info.__dict__), thumbnail_data, current_mtime)
            )
            conn.commit()
            
            return info

    async def scan_directory(
        self,
        directory: Path,
        search: Optional[str] = None,
        sort_by: str = "name",
        page: int = 1,
        page_size: int = 50
    ) -> Dict:
        """Scan directory with caching - only basic file info"""
        logger.debug(f"Scanning directory with caching: {directory}, search: {search}, sort_by: {sort_by}, page: {page}, page_size: {page_size}")
        cache_key = f"{directory}:{search or ''}:{sort_by}"
        
        async with self._db_connection() as conn:
            result = conn.execute(
                "SELECT entries, last_modified FROM directory_cache WHERE path = ?",
                (cache_key,)
            ).fetchone()
            
            dir_mtime = max(p.stat().st_mtime for p in directory.iterdir())
            
            if result and result[1] >= dir_mtime:
                # Return cached results
                items = json.loads(result[0])
                return self._paginate_results(items, page, page_size)

            # Generate basic directory listing without full image info
            items = []
            for entry in directory.iterdir():
                if entry.is_dir():
                    items.append({
                        'type': 'directory',
                        'name': entry.name,
                        'path': str(entry.relative_to(self.root_dir))
                    })
                elif entry.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.jxl'}:
                    stat = entry.stat()
                    items.append({
                        'type': 'image',
                        'name': entry.name,
                        'path': str(entry.relative_to(self.root_dir)),
                        'modified': stat.st_mtime,
                        'size': stat.st_size
                    })

            # Apply search/sort before caching
            if search:
                search = search.lower()
                items = [item for item in items if search in item['name'].lower()]

            if sort_by == "name":
                items.sort(key=lambda x: x['name'].lower())
            elif sort_by == "date":
                items.sort(key=lambda x: x['modified'], reverse=True)
            elif sort_by == "size":
                items.sort(key=lambda x: x['size'], reverse=True)

            # Cache the filtered/sorted results
            conn.execute(
                """
                INSERT OR REPLACE INTO directory_cache 
                (path, entries, last_modified) 
                VALUES (?, ?, ?)
                """,
                (cache_key, json.dumps(items), dir_mtime)
            )
            conn.commit()

            return self._paginate_results(items, page, page_size)

    def _paginate_results(self, items: List[Dict], page: int, page_size: int) -> Dict:
        total = len(items)
        start = (page - 1) * page_size
        end = start + page_size
        
        return {
            'items': items[start:end],
            'total': total,
            'page': page,
            'pages': (total + page_size - 1) // page_size
        }
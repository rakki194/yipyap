from pathlib import Path
import aiofiles
from PIL import Image
import magic
import shutil
from . import utils
from typing import List, Dict, Optional
import os
import logging

import pillow_jxl

from .main import ROOT_DIR
from .drhead_loader import open_srgb


THUMBNAIL_SIZE = (300, 300)
THUMBNAIL_DIR = Path("static/thumbnails")
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.jxl'}

logger = logging.getLogger('uvicorn.error')

async def scan_directory(
    directory: Path,
    search: Optional[str] = None,
    sort_by: str = "name",
    page: int = 1,
    page_size: int = 50
) -> Dict:
    """Scan directory with pagination."""
    items = []
    total_items = 0
    
    try:
        logger.debug(f"Scanning directory: {directory}")
        entries = list(directory.iterdir())
        total_items = len(entries)
        logger.debug(f"Total items found: {total_items}")
        
        # Apply filtering
        if search:
            entries = [e for e in entries if search.lower() in e.name.lower()]
            logger.debug(f"Filtered entries: {len(entries)} matching '{search}'")
        
        # Apply sorting
        entries.sort(key=lambda x: (
            not x.is_dir(),
            x.name.lower() if sort_by == "name"
            else x.stat().st_mtime if sort_by == "date"
            else x.stat().st_size
        ))
        
        # Apply pagination
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_entries = entries[start_idx:end_idx]
        logger.debug(f"Paginated entries from {start_idx} to {end_idx}")

        for entry in paginated_entries:
            item = await create_item_dict(entry)
            items.append(item)
            logger.debug(f"Added item: {item}")

    except PermissionError as e:
        logger.error(f"Permission error: {e}")
    
    return {
        "items": items,
        "total": total_items,
        "page": page,
        "pages": (total_items + page_size - 1) // page_size
    }

async def get_image_info(path: Path) -> dict:
    """Get information about a single image."""
    if not path.is_file():
        raise FileNotFoundError(f"Image not found: {path}")
        
    thumbnail_path = await ensure_thumbnail(path)
    return {
        'name': path.name,
        'path': str(path.relative_to(ROOT_DIR)),
        'thumbnail': str(thumbnail_path.relative_to(Path("static"))),
        'size': path.stat().st_size,
        'modified': path.stat().st_mtime,
        'mime': magic.from_file(str(path), mime=True)
    }

async def ensure_thumbnail(image_path: Path) -> Path:
    """Create thumbnail if it doesn't exist and return its path."""
    # Create a directory structure in thumbnails that mirrors the source
    rel_path = image_path.relative_to(ROOT_DIR)
    thumbnail_path = THUMBNAIL_DIR / rel_path.parent / f"{utils.get_safe_filename(image_path.name)}_thumb.webp"
    
    if not thumbnail_path.exists():
        thumbnail_path.parent.mkdir(parents=True, exist_ok=True)
        with open_srgb(image_path) as img:
            img.thumbnail(THUMBNAIL_SIZE, resample=Image.Resampling.LANCZOS)
            img.save(thumbnail_path, "WEBP", quality=80, method=6)
    
    return thumbnail_path

def is_image_file(path: Path) -> bool:
    """Check if file is an image based on extension."""
    return path.suffix.lower() in ALLOWED_EXTENSIONS

async def create_item_dict(entry: Path) -> Dict:
    """Create dictionary with item information."""
    try:
        if not utils.is_path_safe(entry, ROOT_DIR):
            logger.warning(f"Path is not safe: {entry}")
            return None

        item = {
            'name': entry.name,
            'path': str(entry.relative_to(ROOT_DIR)),
            'type': 'directory' if entry.is_dir() else 'file',
            'modified': entry.stat().st_mtime,
            'size': entry.stat().st_size if entry.is_file() else 0
        }
        
        if entry.is_file():
            if entry.suffix.lower() in ALLOWED_EXTENSIONS:
                item.update({
                    'type': 'image',
                    'thumbnail': str((await ensure_thumbnail(entry)).relative_to(Path("static")))
                })
                logger.debug(f"Item is an image: {item}")
        return item
    except Exception as e:
        logger.exception(f"Error creating item dict for {entry}: {e}")
        return None

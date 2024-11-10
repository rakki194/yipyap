from pathlib import Path
import aiofiles
from PIL import Image
import magic
import shutil
from . import utils
from typing import List, Dict, Optional
import os

THUMBNAIL_SIZE = (300, 300)
THUMBNAIL_DIR = Path("static/thumbnails")
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif'}

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
        entries = list(directory.iterdir())
        total_items = len(entries)
        
        # Apply filtering
        if search:
            entries = [e for e in entries if search.lower() in e.name.lower()]
        
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
        
        for entry in paginated_entries:
            item = await create_item_dict(entry)
            items.append(item)
            
    except PermissionError:
        pass
    
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
        'path': str(path.relative_to(Path.cwd())),
        'thumbnail': str(thumbnail_path.relative_to(Path("static"))),
        'size': path.stat().st_size,
        'modified': path.stat().st_mtime,
        'mime': magic.from_file(str(path), mime=True)
    }

async def ensure_thumbnail(image_path: Path) -> Path:
    """Create thumbnail if it doesn't exist and return its path."""
    # Create a directory structure in thumbnails that mirrors the source
    rel_path = image_path.relative_to(Path.cwd())
    thumbnail_path = THUMBNAIL_DIR / rel_path.parent / f"{utils.get_safe_filename(image_path.name)}_thumb.jpg"
    
    if not thumbnail_path.exists():
        thumbnail_path.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(image_path) as img:
            img.thumbnail(THUMBNAIL_SIZE)
            img.save(thumbnail_path, "JPEG")
    
    return thumbnail_path

def is_image_file(path: Path) -> bool:
    """Check if file is an image based on extension."""
    return path.suffix.lower() in ALLOWED_EXTENSIONS

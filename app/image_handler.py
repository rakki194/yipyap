from pathlib import Path
import aiofiles
from PIL import Image
import magic
import shutil
from . import utils
from typing import List, Dict
import os

THUMBNAIL_SIZE = (300, 300)
THUMBNAIL_DIR = Path("static/thumbnails")
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif'}

async def scan_directory(directory: Path) -> List[Dict]:
    """Scan directory and return both subdirectories and images."""
    items = []
    
    try:
        for entry in sorted(directory.iterdir()):
            item = {
                'name': entry.name,
                'path': str(entry.relative_to(Path.cwd())),
                'type': 'directory' if entry.is_dir() else 'file',
                'modified': entry.stat().st_mtime
            }
            
            if entry.is_file():
                if entry.suffix.lower() in ALLOWED_EXTENSIONS:
                    item.update({
                        'type': 'image',
                        'thumbnail': str((await ensure_thumbnail(entry)).relative_to(Path("static"))),
                        'size': entry.stat().st_size,
                        'mime': magic.from_file(str(entry), mime=True)
                    })
                elif not entry.name.endswith('.caption'):  # Skip caption files
                    item['type'] = 'file'
            
            items.append(item)
            
    except PermissionError:
        # Handle permission errors gracefully
        pass
    
    return items

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

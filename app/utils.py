import re
from pathlib import Path

def get_safe_filename(filename: str) -> str:
    """Convert filename to safe version."""
    filename = str(filename).strip().replace(' ', '_')
    filename = re.sub(r'(?u)[^-\w.]', '', filename)
    return filename

def is_image_file(path: Path) -> bool:
    """Check if file is an image based on extension."""
    return path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif'}

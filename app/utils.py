import re
from pathlib import Path

def get_safe_filename(filename: str) -> str:
    """Convert filename to safe version."""
    filename = str(filename).strip().replace(' ', '_')
    filename = re.sub(r'(?u)[^-\w.]', '', filename)
    return filename

def get_human_readable_size(size_in_bytes: int) -> str:
    """Convert bytes to human readable string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_in_bytes < 1024:
            return f"{size_in_bytes:.1f} {unit}"
        size_in_bytes /= 1024
    return f"{size_in_bytes:.1f} TB"

def is_path_safe(path: Path, root: Path) -> bool:
    """Check if path is safe (within root directory)."""
    try:
        return str(path.resolve()).startswith(str(root.resolve()))
    except (ValueError, RuntimeError):
        return False

import re
from pathlib import Path
from fastapi import HTTPException


def get_safe_filename(filename: str) -> str:
    """Convert filename to safe version."""
    filename = str(filename).strip().replace(" ", "_")
    filename = re.sub(r"(?u)[^-\w.]", "", filename)
    return filename


def get_human_readable_size(size_in_bytes: int) -> str:
    """Convert bytes to human readable string."""
    for unit in ["B", "KB", "MB", "GB"]:
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


def resolve_path(path: str, root: Path) -> Path:
    if path in {"", "/"}:
        return root
    resolved_path = (root / path).resolve()
    if resolved_path.is_relative_to(root):
        return resolved_path
    else:
        raise HTTPException(status_code=403, detail="Access denied")

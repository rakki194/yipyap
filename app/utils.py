"""
Utility functions for the yipyap backend.

This module provides helper functions for common operations like:
- File name sanitization
- Human-readable size formatting
- Path safety validation
- Path resolution with security checks

These utilities are used throughout the application to ensure consistent
handling of files and paths while maintaining security.
"""

import re
from pathlib import Path
from fastapi import HTTPException


def get_safe_filename(filename: str) -> str:
    """
    Convert a filename to a safe version.
    
    Args:
        filename (str): Original filename
        
    Returns:
        str: Sanitized filename with unsafe characters removed
        
    Example:
        >>> get_safe_filename("My File (1).jpg")
        'My_File_1.jpg'
    """
    filename = str(filename).strip().replace(" ", "_")
    filename = re.sub(r"(?u)[^-\w.]", "", filename)
    return filename


def get_human_readable_size(size_in_bytes: int) -> str:
    """
    Convert bytes to human readable string.
    
    Args:
        size_in_bytes (int): Size in bytes
        
    Returns:
        str: Human-readable size with units
        
    Example:
        >>> get_human_readable_size(1234567)
        '1.2 MB'
    """
    for unit in ["B", "KB", "MB", "GB"]:
        if size_in_bytes < 1024:
            return f"{size_in_bytes:.1f} {unit}"
        size_in_bytes /= 1024
    return f"{size_in_bytes:.1f} TB"


def is_path_safe(path: Path, root: Path) -> bool:
    """
    Check if path is safe (within root directory).
    
    Args:
        path (Path): Path to check
        root (Path): Root directory path
        
    Returns:
        bool: True if path is within root directory
        
    Notes:
        - Resolves symlinks before checking
        - Prevents directory traversal attacks
    """
    try:
        return str(path.resolve()).startswith(str(root.resolve()))
    except (ValueError, RuntimeError):
        return False


def resolve_path(path: str, root: Path) -> Path:
    """
    Resolve a relative path against the root directory with security checks.
    
    Args:
        path (str): Relative path to resolve
        root (Path): Root directory path
        
    Returns:
        Path: Resolved absolute path
        
    Raises:
        HTTPException: If path is outside root directory
        
    Notes:
        - Handles empty paths as root directory
        - Prevents directory traversal
        - Resolves symlinks
    """
    if path in {"", "/"}:
        return root
    resolved_path = (root / path).resolve()
    if resolved_path.is_relative_to(root):
        return resolved_path
    else:
        raise HTTPException(status_code=403, detail="Access denied")

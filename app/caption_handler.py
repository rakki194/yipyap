"""
Caption file handling utilities.

This module provides asynchronous functions for reading and writing caption files.
It uses aiofiles for non-blocking file operations to maintain server responsiveness
when handling large numbers of caption operations.

Functions:
- get_caption: Read caption from file
- save_caption: Write caption to file
"""

from pathlib import Path
import aiofiles


async def get_caption(caption_path: Path) -> str:
    """
    Read caption from file if it exists.
    
    Args:
        caption_path (Path): Path to caption file
        
    Returns:
        str: Caption text or empty string if file not found
        
    Notes:
        - Uses aiofiles for async file reading
        - Returns empty string for missing files
    """
    try:
        async with aiofiles.open(caption_path, mode="r") as f:
            return await f.read()
    except FileNotFoundError:
        return ""


async def save_caption(caption_path: Path, caption: str) -> None:
    """
    Save caption to file.
    
    Args:
        caption_path (Path): Path to caption file
        caption (str): Caption text to save
        
    Notes:
        - Uses aiofiles for async file writing
        - Creates parent directories if needed
        - Overwrites existing file
    """
    async with aiofiles.open(caption_path, mode="w") as f:
        await f.write(caption)

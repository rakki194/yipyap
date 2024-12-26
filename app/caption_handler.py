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
import json
from typing import Union
from .caption_formats import (
    read_e621_file,
    write_e621_file,
    create_empty_e621_file,
    E621FormatError,
)


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
        - Handles special formats (e621) appropriately
    """
    try:
        # Handle e621 JSON files
        if caption_path.suffix == '.e621':
            data = await read_e621_file(caption_path)
            # Convert e621 JSON to a string representation
            return json.dumps(data, indent=2, ensure_ascii=False)
            
        # Handle regular text files
        async with aiofiles.open(caption_path, mode="r", encoding='utf-8') as f:
            return await f.read()
    except (FileNotFoundError, E621FormatError):
        return ""


async def save_caption(caption_path: Path, caption: Union[str, dict]) -> None:
    """
    Save caption to file.
    
    Args:
        caption_path (Path): Path to caption file
        caption (Union[str, dict]): Caption text or data to save
        
    Notes:
        - Uses aiofiles for async file writing
        - Creates parent directories if needed
        - Handles special formats (e621) appropriately
        - For e621 files, accepts either JSON string or dict
    """
    caption_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Handle e621 JSON files
    if caption_path.suffix == '.e621':
        if isinstance(caption, str):
            try:
                data = json.loads(caption)
            except json.JSONDecodeError:
                # If invalid JSON string, create empty e621 file
                data = create_empty_e621_file()
        else:
            data = caption
        await write_e621_file(caption_path, data)
        return
        
    # Handle regular text files
    async with aiofiles.open(caption_path, mode="w", encoding='utf-8') as f:
        await f.write(caption if isinstance(caption, str) else str(caption))

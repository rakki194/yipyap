"""
E621 JSON format handler.

This module provides functions for reading and writing e621 JSON format files.
The e621 format is a structured JSON format that organizes tags into categories.

Format specification:
{
    "md5": "string",
    "tags": {
        "general": ["tag1", "tag2", ...],
        "artist": ["artist1", "artist2", ...],
        "species": ["species1", "species2", ...],
        "meta": ["meta1", "meta2", ...]
    },
    "implied_tags": {
        "general": ["implied1", "implied2", ...],
        "artist": ["implied_artist1", ...],
        "copyright": ["copyright1", ...],
        "species": ["implied_species1", ...]
    }
}
"""

import json
import aiofiles
from pathlib import Path
from typing import Dict, List, Optional, Union

# Default structure for new e621 files
DEFAULT_E621_STRUCTURE = {
    "md5": "",
    "tags": {
        "general": [],
        "artist": [],
        "species": [],
        "meta": []
    },
    "implied_tags": {
        "general": [],
        "artist": [],
        "copyright": [],
        "species": []
    }
}

class E621FormatError(Exception):
    """Raised when e621 JSON format is invalid."""
    pass

def validate_e621_structure(data: Dict) -> bool:
    """
    Validate the structure of e621 JSON data.
    
    Args:
        data: Dictionary containing e621 JSON data
        
    Returns:
        bool: True if valid, False otherwise
        
    Raises:
        E621FormatError: If format is invalid with specific error message
    """
    if not isinstance(data, dict):
        raise E621FormatError("Root must be a dictionary")
        
    # Check required fields
    if "tags" not in data:
        raise E621FormatError("Missing required field: tags")
        
    # Validate tags structure
    if not isinstance(data["tags"], dict):
        raise E621FormatError("'tags' must be a dictionary")
        
    required_tag_categories = {"general", "artist", "species", "meta"}
    for category in required_tag_categories:
        if category not in data["tags"]:
            raise E621FormatError(f"Missing required tag category: {category}")
        if not isinstance(data["tags"][category], list):
            raise E621FormatError(f"Tag category '{category}' must be a list")
            
    # Validate implied_tags if present
    if "implied_tags" in data:
        if not isinstance(data["implied_tags"], dict):
            raise E621FormatError("'implied_tags' must be a dictionary")
            
        implied_categories = {"general", "artist", "copyright", "species"}
        for category in data["implied_tags"]:
            if category not in implied_categories:
                raise E621FormatError(f"Invalid implied tag category: {category}")
            if not isinstance(data["implied_tags"][category], list):
                raise E621FormatError(f"Implied tag category '{category}' must be a list")
                
    return True

async def read_e621_file(file_path: Path) -> Dict:
    """
    Read and parse an e621 JSON file.
    
    Args:
        file_path: Path to the e621 JSON file
        
    Returns:
        dict: Parsed e621 JSON data
        
    Raises:
        E621FormatError: If file format is invalid
        json.JSONDecodeError: If JSON parsing fails
    """
    try:
        async with aiofiles.open(file_path, mode='r', encoding='utf-8') as f:
            content = await f.read()
            data = json.loads(content)
            validate_e621_structure(data)
            return data
    except json.JSONDecodeError as e:
        raise E621FormatError(f"Invalid JSON format: {str(e)}")

async def write_e621_file(file_path: Path, data: Dict) -> None:
    """
    Write data to an e621 JSON file.
    
    Args:
        file_path: Path to write the e621 JSON file
        data: Dictionary containing e621 JSON data
        
    Raises:
        E621FormatError: If data format is invalid
    """
    validate_e621_structure(data)
    
    async with aiofiles.open(file_path, mode='w', encoding='utf-8') as f:
        formatted_json = json.dumps(data, indent=2, ensure_ascii=False)
        await f.write(formatted_json)

def create_empty_e621_file() -> Dict:
    """
    Create an empty e621 JSON structure.
    
    Returns:
        dict: Empty e621 JSON structure
    """
    return DEFAULT_E621_STRUCTURE.copy()

def merge_e621_tags(base: Dict, update: Dict) -> Dict:
    """
    Merge two e621 tag structures, combining tag lists.
    
    Args:
        base: Base e621 JSON structure
        update: Update e621 JSON structure to merge
        
    Returns:
        dict: Merged e621 JSON structure
    """
    result = base.copy()
    
    # Merge tags
    for category in update.get("tags", {}):
        if category in result["tags"]:
            result["tags"][category] = list(set(result["tags"][category] + update["tags"][category]))
        else:
            result["tags"][category] = update["tags"][category]
            
    # Merge implied tags if present
    if "implied_tags" in update:
        if "implied_tags" not in result:
            result["implied_tags"] = {}
        for category in update["implied_tags"]:
            if category in result["implied_tags"]:
                result["implied_tags"][category] = list(set(result["implied_tags"][category] + update["implied_tags"][category]))
            else:
                result["implied_tags"][category] = update["implied_tags"][category]
                
    return result 
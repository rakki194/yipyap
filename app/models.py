"""
Data models for the yipyap backend.

This module defines Pydantic models that represent the core data structures used
throughout the application. These models ensure type safety and provide automatic
validation for data passing between components.

The models are organized into several categories:
- View configuration (ViewMode)
- File system items (BaseItem, ImageModel, DirectoryModel)
- Directory browsing (BrowseHeader, BrowseResponse)
- Caption management (CaptionUpdate)

Each model includes validation rules and default values where appropriate.
"""

from typing import List, Tuple, Union, Literal
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class ViewMode(str, Enum):
    """
    Gallery view mode options.
    
    Defines the available display modes for the gallery view:
    - grid: Thumbnail grid layout
    - list: Detailed list layout
    """
    grid = "grid"  # Grid layout with thumbnails
    list = "list"  # List layout with details


class CaptionUpdate(BaseModel):
    """
    Model for caption update requests.
    
    Used when updating the caption text for an image.
    
    Attributes:
        caption (str): The new caption text
    """
    caption: str


class BaseItem(BaseModel):
    """
    Base model for both images and directories.
    
    Provides common attributes shared by both file types.
    
    Attributes:
        type (str): Item type ("image" or "directory")
        name (str): Item name
        mtime (datetime): Last modification time
    """
    type: str  # Item type ("image" or "directory")
    name: str  # Item name
    mtime: datetime  # Last modification time


class BrowseHeader(BaseModel):
    """
    Metadata for directory browse responses.
    
    Contains information about the current directory listing
    and pagination details.
    
    Attributes:
        mtime (datetime): Directory modification time
        page (int): Current page number
        pages (int): Total number of pages
        folders (List[str]): List of folder names
        images (List[str]): List of image names
        total_folders (int): Total folder count
        total_images (int): Total image count
    """
    mtime: datetime  # Directory modification time
    page: int  # Current page number
    pages: int  # Total number of pages
    folders: List[str]  # List of folder names
    images: List[str]  # List of image names
    total_folders: int  # Total folder count
    total_images: int  # Total image count


class ImageModel(BaseItem):
    """
    Image item with metadata and captions.
    
    Extends BaseItem with image-specific attributes.
    
    Attributes:
        type (Literal["image"]): Always "image"
        size (int): File size in bytes
        mime (str): MIME type
        md5sum (str): MD5 hash of file
        width (int): Image width in pixels
        height (int): Image height in pixels
        captions (List[Tuple[str, str]]): List of (type, text) caption pairs
    """
    type: Literal["image"] = "image"
    size: int  # File size in bytes
    mime: str = Field(default="application/octet-stream")
    md5sum: str  # MD5 hash of file
    width: int = Field(default=0)  # Image width
    height: int = Field(default=0)  # Image height
    captions: List[Tuple[str, str]] = Field(default=[])  # [(type, text), ...]


class DirectoryModel(BaseItem):
    """
    Directory item model.
    
    Extends BaseItem for directory entries.
    
    Attributes:
        type (Literal["directory"]): Always "directory"
    """
    type: Literal["directory"] = "directory"


class BrowseResponse(BaseModel):
    """
    Complete response for directory browse requests.
    
    Contains both the directory contents and pagination info.
    
    Attributes:
        items (List[Union[BrowseHeader, ImageModel, DirectoryModel]]): Directory contents
        totalPages (int): Total number of pages available
    """
    items: List[Union[BrowseHeader, ImageModel, DirectoryModel]]
    totalPages: int

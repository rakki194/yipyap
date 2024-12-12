"""
Data models for the yipyap backend.

This module defines Pydantic models that represent the core data structures used
throughout the application. These models ensure type safety and provide automatic
validation for data passing between components.

Models:
- ViewMode: Enum for gallery view modes
- BaseItem: Common fields for all items
- ImageModel: Image metadata and properties
- DirectoryModel: Directory information
- BrowseHeader: Directory listing metadata
- BrowseResponse: Complete browse endpoint response
"""

from typing import List, Tuple, Union, Literal
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class ViewMode(str, Enum):
    """Gallery view mode options."""
    grid = "grid"  # Grid layout with thumbnails
    list = "list"  # List layout with details


class CaptionUpdate(BaseModel):
    """Model for caption update requests."""
    caption: str


class BaseItem(BaseModel):
    """Base model for both images and directories."""
    type: str  # Item type ("image" or "directory")
    name: str  # Item name
    mtime: datetime  # Last modification time


class BrowseHeader(BaseModel):
    """Metadata for directory browse responses."""
    mtime: datetime  # Directory modification time
    page: int  # Current page number
    pages: int  # Total number of pages
    folders: List[str]  # List of folder names
    images: List[str]  # List of image names
    total_folders: int  # Total folder count
    total_images: int  # Total image count


class ImageModel(BaseItem):
    """Image item with metadata and captions."""
    type: Literal["image"] = "image"
    size: int  # File size in bytes
    mime: str = Field(default="application/octet-stream")
    md5sum: str  # MD5 hash of file
    width: int = Field(default=0)  # Image width
    height: int = Field(default=0)  # Image height
    captions: List[Tuple[str, str]] = Field(default=[])  # [(type, text), ...]


class DirectoryModel(BaseItem):
    """Directory item model."""
    type: Literal["directory"] = "directory"


class BrowseResponse(BaseModel):
    """Complete response for directory browse requests."""
    items: List[Union[BrowseHeader, ImageModel, DirectoryModel]]
    totalPages: int

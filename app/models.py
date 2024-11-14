from typing import Optional, List, Union, Dict, Literal, Annotated
from enum import Enum
from pydantic import BaseModel, Field


class ViewMode(str, Enum):
    grid = "grid"
    list = "list"


class CaptionUpdate(BaseModel):
    caption: str


class BaseItem(BaseModel):
    type: str
    name: str
    path: str


class ImageModel(BaseItem):
    type: Literal["image"] = "image"
    size: int
    modified: float
    mime: str = Field(default="application/octet-stream")  # Default value
    width: int = Field(default=0)  # Default value
    height: int = Field(default=0)  # Default value


class DirectoryModel(BaseItem):
    type: Literal["directory"] = "directory"


class BrowseResponse(BaseModel):
    items: List[Union[ImageModel, DirectoryModel]]
    totalPages: int

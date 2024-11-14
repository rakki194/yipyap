from typing import List, Tuple, Union, Literal
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
    mtime: str


class ImageModel(BaseItem):
    type: Literal["image"] = "image"
    size: int
    mime: str = Field(default="application/octet-stream")  # Default value
    md5sum: str
    width: int = Field(default=0)  # Default value
    height: int = Field(default=0)  # Default value
    captions: List[Tuple[str, str]] = Field(default=[])


class DirectoryModel(BaseItem):
    type: Literal["directory"] = "directory"


class BrowseResponse(BaseModel):
    items: List[Union[ImageModel, DirectoryModel]]
    totalPages: int

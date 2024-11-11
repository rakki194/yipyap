from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
from typing import Optional
from enum import Enum
import datetime
import asyncio
import logging
import os
from fastapi.responses import StreamingResponse, FileResponse, Response
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware

from .data_access import CachedFileSystemDataSource, ImageInfo
from .drhead_loader import open_srgb
from . import utils

logger = logging.getLogger('uvicorn.error')

class SortBy(str, Enum):
    name = "name"
    date = "date"
    size = "size"

class ViewMode(str, Enum):
    grid = "grid"
    list = "list"

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
TemplateResponse = templates.TemplateResponse

# Initialize data source
ROOT_DIR = Path(os.getenv("ROOT_DIR", Path.cwd()))
THUMBNAIL_SIZE = (300, 300)
data_source = CachedFileSystemDataSource(ROOT_DIR, THUMBNAIL_SIZE)

if True or os.getenv("DEVELOPMENT"): #FIXME: remove True
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/thumbnail/{path:path}")
async def get_thumbnail(path: str):
    """Serve cached thumbnail"""
    try:
        image_path = (ROOT_DIR / path).resolve()
        if not utils.is_path_safe(image_path, ROOT_DIR):
            raise HTTPException(status_code=403, detail="Access denied")
            
        thumbnail_data = await data_source.get_thumbnail(str(image_path))
        if not thumbnail_data:
            raise HTTPException(status_code=404, detail="Thumbnail not found")
            
        return Response(
            thumbnail_data,
            media_type="image/webp",
            headers={"Cache-Control": "public, max-age=31536000"}
        )
    except Exception as e:
        logger.exception(f"Error serving thumbnail for {path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/preview/{path:path}")
async def preview_image(path: str):
    """Generate preview image (larger than thumbnail, smaller than original)"""
    try:
        image_path = (ROOT_DIR / path).resolve()
        if not utils.is_path_safe(image_path, ROOT_DIR):
            raise HTTPException(status_code=403, detail="Access denied")
            
        if not image_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")
            
        PREVIEW_SIZE = (1200, 1200)  # Max dimensions for preview
        
        with open_srgb(image_path) as img:
            img.thumbnail(PREVIEW_SIZE)
            output = BytesIO()
            img.save(output, format='WebP', quality=85)
            output.seek(0)
            
        return StreamingResponse(
            output,
            media_type="image/webp",
            headers={"Cache-Control": "public, max-age=31536000"}
        )
    except Exception as e:
        logger.exception(f"Error generating preview for {path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{path:path}")
async def download_image(path: str):
    """Download original image file"""
    try:
        image_path = (ROOT_DIR / path).resolve()
        if not utils.is_path_safe(image_path, ROOT_DIR):
            raise HTTPException(status_code=403, detail="Access denied")
            
        if not image_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")
            
        return FileResponse(
            image_path,
            filename=image_path.name,
            headers={"Cache-Control": "public, max-age=31536000"}
        )
    except Exception as e:
        logger.exception(f"Error downloading {path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/{path:path}")
async def browse(
    request: Request, 
    path: str = "", 
    search: Optional[str] = Query(None),
    sort_by: SortBy = Query(default=SortBy.name),
    view_mode: ViewMode = Query(default=ViewMode.grid),
    page: int = Query(default=1)
):
    target_path = (ROOT_DIR / path).resolve()
    logger.debug(f"Browsing path: {target_path}, search: {search}, sort_by: {sort_by}, view_mode: {view_mode}, page: {page}")

    if not utils.is_path_safe(target_path, ROOT_DIR):
        logger.warning(f"Access denied for path: {target_path}")
        raise HTTPException(status_code=403, detail="Access denied")
        
    if not target_path.exists():
        logger.warning(f"Path not found: {target_path}")
        raise HTTPException(status_code=404, detail="Path not found")
        
    if target_path.is_file():
        if not data_source.is_image_file(target_path):
            logger.warning(f"Not an image file: {target_path}")
            raise HTTPException(status_code=400, detail="Not an image file")
        return await view_file(request, target_path)
        
    # Get directory listing with pagination
    result = await data_source.scan_directory(
        directory=target_path,
        search=search,
        sort_by=sort_by.value,
        page=page
    )
    
    logger.info(f"Retrieved {len(result['items'])} items from {target_path} (Page {result['page']} of {result['pages']})")

    # For the current page only, load full image info in parallel
    tasks = [data_source.get_image_info(ROOT_DIR / item['path']) for item in result['items'] if item['type'] == 'image']
    image_infos = await asyncio.gather(*tasks)
    for item, image_info in zip(result['items'], image_infos):
        if item['type'] == 'image':
            item.update(image_info.__dict__)
            item['thumbnail_path'] = str(Path(image_info.path).with_suffix('.webp'))
    
    return templates.TemplateResponse(
        "gallery.html",
        {
            "request": request,
            "current_path": path,
            "parent_path": str(Path(path).parent),
            "items": result['items'],
            "total": result['total'],
            "page": result['page'],
            "pages": result['pages'],
            "view_mode": view_mode,
            "current_sort": sort_by,
            "current_search": search
        }
    )

async def view_file(request: Request, path: Path) -> TemplateResponse:
    """Handle single image view"""
    try:
        image_info = await data_source.get_image_info(path)
        image_info.modified = datetime.datetime.fromtimestamp(image_info.modified).strftime('%Y-%m-%d')
        caption = await data_source.get_caption(path)
        
        return templates.TemplateResponse(
            "image_view.html",
            {
                "request": request,
                "image": image_info,
                "caption": caption
            }
        )
    except Exception as e:
        logger.exception(f"Error viewing file {path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

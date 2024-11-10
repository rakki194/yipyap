from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
import os
from datetime import datetime
from enum import Enum
from typing import Optional
from fastapi.responses import JSONResponse
from fastapi import Depends
from fastapi.security import HTTPBasic
from slowapi import Limiter
from slowapi.util import get_remote_address
# Overload ROOT_DIR with environment variable if provided
ROOT_DIR = Path(os.getenv("ROOT_DIR", Path.cwd()))
from . import image_handler, caption_handler, utils
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize FastAPI first
app = FastAPI()

# Initialize limiter after app
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

def create_jinja_env(templates):
    def format_datetime(timestamp):
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M')

    def format_filesize(size):
        return utils.get_human_readable_size(size)

    # Register filters in the environment
    templates.env.filters["datetime"] = format_datetime
    templates.env.filters["filesizeformat"] = format_filesize

# Add after creating templates
create_jinja_env(templates)

# Add these enums for type safety
class SortBy(str, Enum):
    name = "name"
    date = "date"
    size = "size"

class ViewMode(str, Enum):
    grid = "grid"
    list = "list"

@app.get("/{path:path}")
async def browse(
    request: Request, 
    path: str = "", 
    search: Optional[str] = Query(None),
    sort_by: SortBy = Query(default=SortBy.name),
    view_mode: ViewMode = Query(default=ViewMode.grid)
):
    try:
        target_path = (ROOT_DIR / path).resolve()
        logger.debug(f"Browsing path: {target_path}")

        if not str(target_path).startswith(str(ROOT_DIR)):
            logger.warning(f"Access denied for path: {target_path}")
            raise HTTPException(status_code=403, detail="Access denied")

        if not target_path.exists():
            logger.warning(f"Path not found: {target_path}")
            raise HTTPException(status_code=404, detail="Path not found")

        if target_path.is_file():
            logger.debug(f"Viewing file: {target_path}")
            return await view_file(request, target_path)
        
        # Get directory items with sorting and filtering
        logger.debug(f"Scanning directory: {target_path}")
        items = await image_handler.scan_directory(
            directory=target_path,
            search=search,
            sort_by=sort_by
        )

        # Filter out non-image items
        items['items'] = [item for item in items['items'] if item['type'] == 'image' or item['type'] == 'directory']
        
        logger.debug(f"Found {len(items['items'])} image items in directory: {target_path}")
        if logger.isEnabledFor(logging.DEBUG):
            import pprint
            logger.debug(f"Items for {target_path} ({len(items['items'])} items): {pprint.pformat(items)}")

        return templates.TemplateResponse(
            "gallery.html",
            {
                "request": request,
                "current_path": path,
                "parent_path": str(Path(path).parent),
                "items": items['items'],
                "view_mode": view_mode,
                "current_sort": sort_by,
                "current_search": search
            }
        )
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def view_file(request: Request, file_path: Path):
    if image_handler.is_image_file(file_path):
        image_info = await image_handler.get_image_info(file_path)
        caption = await caption_handler.get_caption(file_path.with_suffix('.caption'))
        return templates.TemplateResponse(
            "image_view.html",
            {"request": request, "image": image_info, "caption": caption}
        )
    else:
        raise HTTPException(status_code=400, detail="Not an image file")

@app.put("/caption/{path:path}")
@limiter.limit("5/minute")
async def update_caption(
    path: str,
    caption: str,
    request: Request
):
    target_path = (ROOT_DIR / path).resolve()
    if not utils.is_path_safe(target_path, ROOT_DIR):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not target_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        await caption_handler.save_caption(target_path.with_suffix('.caption'), caption)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if request.headers.get("HX-Request"):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail}
        )
    
    # Extract path from request
    path = request.path_params.get("path", "")
    
    return templates.TemplateResponse(
        "error.html",
        {
            "request": request,
            "status_code": exc.status_code,
            "detail": exc.detail,
            "current_path": path  # Add current_path to context
        },
        status_code=exc.status_code
    )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, log_level="trace", reload=True) 

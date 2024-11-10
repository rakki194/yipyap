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

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Use current working directory as root
ROOT_DIR = Path.cwd()

def create_jinja_env(templates):
    @templates.app_template_filter('datetime')
    def format_datetime(timestamp):
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M')

    @templates.app_template_filter('filesizeformat')
    def format_filesize(size):
        return utils.get_human_readable_size(size)

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
        if not str(target_path).startswith(str(ROOT_DIR)):
            raise HTTPException(status_code=403, detail="Access denied")

        if not target_path.exists():
            raise HTTPException(status_code=404, detail="Path not found")

        if target_path.is_file():
            return await view_file(request, target_path)
        
        # Get directory items with sorting and filtering
        items = await image_handler.scan_directory(
            directory=target_path,
            search=search,
            sort_by=sort_by
        )

        return templates.TemplateResponse(
            "gallery.html",
            {
                "request": request,
                "current_path": path,
                "parent_path": str(Path(path).parent),
                "items": items,
                "view_mode": view_mode,
                "current_sort": sort_by,
                "current_search": search
            }
        )

    except Exception as e:
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
    return templates.TemplateResponse(
        "error.html",
        {
            "request": request,
            "status_code": exc.status_code,
            "detail": exc.detail
        },
        status_code=exc.status_code
    )

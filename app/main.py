from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
import os
from datetime import datetime

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

@app.get("/{path:path}")
async def browse(request: Request, path: str = ""):
    try:
        # Convert path to absolute and check if it's within ROOT_DIR
        target_path = (ROOT_DIR / path).resolve()
        if not str(target_path).startswith(str(ROOT_DIR)):
            raise HTTPException(status_code=403, detail="Access denied")

        if not target_path.exists():
            raise HTTPException(status_code=404, detail="Path not found")

        if target_path.is_file():
            return await view_file(request, target_path)
        
        # Directory browsing
        items = await image_handler.scan_directory(target_path)
        return templates.TemplateResponse(
            "gallery.html",
            {
                "request": request,
                "current_path": path,
                "parent_path": str(Path(path).parent),
                "items": items
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
async def update_caption(path: str, caption: str):
    target_path = (ROOT_DIR / path).resolve()
    if not str(target_path).startswith(str(ROOT_DIR)):
        raise HTTPException(status_code=403, detail="Access denied")
    
    await caption_handler.save_caption(target_path.with_suffix('.caption'), caption)
    return {"status": "success"}

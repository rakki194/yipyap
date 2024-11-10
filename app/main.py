from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
from . import image_handler, caption_handler

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Configuration
IMAGE_DIR = Path("images")  # Change this to your images directory
IMAGE_DIR.mkdir(exist_ok=True)

@app.get("/")
async def home(request: Request):
    images = await image_handler.get_images(IMAGE_DIR)
    return templates.TemplateResponse(
        "gallery.html",
        {"request": request, "images": images}
    )

@app.get("/image/{image_path:path}")
async def view_image(request: Request, image_path: str):
    image_info = await image_handler.get_image_info(IMAGE_DIR / image_path)
    caption = await caption_handler.get_caption(IMAGE_DIR / f"{image_path}.caption")
    return templates.TemplateResponse(
        "image_view.html",
        {"request": request, "image": image_info, "caption": caption}
    )

@app.put("/caption/{image_path:path}")
async def update_caption(image_path: str, caption: str):
    await caption_handler.save_caption(IMAGE_DIR / f"{image_path}.caption", caption)
    return {"status": "success"}

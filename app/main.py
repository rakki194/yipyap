import asyncio
import json
from pathlib import Path
import logging
import os

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from .data_access import CachedFileSystemDataSource
from . import utils

logger = logging.getLogger("uvicorn.error")


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
TemplateResponse = templates.TemplateResponse

# Initialize data source
ROOT_DIR = Path(os.getenv("ROOT_DIR", Path.cwd()))
THUMBNAIL_SIZE = (300, 300)
PREVIEW_SIZE = (1024, 1024)
data_source = CachedFileSystemDataSource(ROOT_DIR, THUMBNAIL_SIZE, PREVIEW_SIZE)

if True or os.getenv("DEVELOPMENT"):  # FIXME: remove True
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/api/browse")
async def browse(
    path: str = "", page: int = Query(1, ge=1), page_size: int = Query(50, ge=1)
):
    target_path = (ROOT_DIR / path).resolve()
    if not utils.is_path_safe(target_path, ROOT_DIR):
        raise HTTPException(status_code=403, detail="Access denied")

    header, items, futures = data_source.analyze_dir(
        directory=target_path, page=page, page_size=page_size
    )

    async def stream_response():
        yield f"{json.dumps(header)}\n"
        for item in items:
            yield f"{json.dumps(item.model_dump())}\n"
        for future in asyncio.as_completed(futures):
            res = await future
            yield f"{json.dumps(res.model_dump())}\n"

    # Sends header and items as a ndjson chuncked response
    return StreamingResponse(
        stream_response(),
        media_type="application/json",
    )


@app.get("/thumbnail/{path:path}")
async def get_thumbnail(path: str):
    image_path = (ROOT_DIR / path).resolve()
    if not utils.is_path_safe(image_path, ROOT_DIR):
        raise HTTPException(status_code=403, detail="Access denied")

    thumbnail_data = await data_source.get_thumbnail(image_path)
    return Response(
        thumbnail_data,
        media_type="image/webp",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


@app.get("/preview/{path:path}")
async def get_preview(path: str):
    image_path = (ROOT_DIR / path).resolve()
    if not utils.is_path_safe(image_path, ROOT_DIR):
        raise HTTPException(status_code=403, detail="Access denied")

    preview_data = await data_source.get_preview(image_path)
    return Response(
        preview_data,
        media_type="image/webp",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


@app.get("/download/{path:path}")
async def download_image(path: str):
    try:
        image_path = (ROOT_DIR / path).resolve()
        if not utils.is_path_safe(image_path, ROOT_DIR):
            raise HTTPException(status_code=403, detail="Access denied")

        return FileResponse(
            image_path,
            filename=image_path.name,
            headers={"Cache-Control": "public, max-age=31536000"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/caption/{path:path}")
async def update_caption(path: str, caption_update: str):
    try:
        image_path = (ROOT_DIR / path).resolve()
        if not utils.is_path_safe(image_path, ROOT_DIR):
            raise HTTPException(status_code=403, detail="Access denied")

        await data_source.save_caption(image_path, caption_update.caption)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/config")
async def get_config():
    """Endpoint to get the configured preview and thumbnail sizes."""
    return {
        "thumbnail_size": data_source.thumbnail_size,
        "preview_size": data_source.preview_size,
    }


is_dev = os.getenv("ENVIRONMENT", "development").lower() == "development"
if not is_dev:
    app.mount("/", StaticFiles(directory="static/dist", html=True), name="static")

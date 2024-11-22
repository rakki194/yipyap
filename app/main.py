import asyncio
from pathlib import Path
import logging
import os

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from email.utils import parsedate_to_datetime, format_datetime

from .data_access import CachedFileSystemDataSource
from . import utils

logger = logging.getLogger("uvicorn.error")


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
TemplateResponse = templates.TemplateResponse

# Initialize data source
ROOT_DIR = Path(os.getenv("ROOT_DIR", Path.cwd())).resolve()
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
    request: Request,
    path: str = "",
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1),
):
    target_path = utils.resolve_path(path, ROOT_DIR)

    # Parse If-Modified-Since header if present
    if_modified_since = None
    if_modified_since_header = request.headers.get("if-modified-since")
    if if_modified_since_header:
        if_modified_since = parsedate_to_datetime(if_modified_since_header)

    # Check if this is a HEAD request
    is_head = request.method == "HEAD"

    browser_header, items, futures = data_source.analyze_dir(
        directory=target_path,
        page=page,
        page_size=page_size,
        http_head=is_head,
        if_modified_since=if_modified_since,
    )

    last_modified = format_datetime(browser_header.mtime, usegmt=True)
    headers = {
        "Last-Modified": last_modified,
        "Cache-Control": "public, max-age=0, must-revalidate",
    }

    # If items is None, it means we should return 304 Not Modified
    if items is None and if_modified_since:
        logger.info(f"304 Not Modified: {path}:{page} {last_modified}")
        return Response(status_code=304, headers=headers)

    # For HEAD requests, return just the header
    if is_head:
        return Response(
            content=browser_header.model_dump_json(),  # Use Pydantic's json method for serialization
            media_type="application/json",
            headers=headers,
        )

    async def stream_response():
        yield f"{browser_header.model_dump_json()}\n"  # Use Pydantic's json method for serialization
        for item in items:
            yield f"{item.model_dump_json()}\n"
        for future in asyncio.as_completed(futures):
            res = await future
            yield f"{res.model_dump_json()}\n"

    return StreamingResponse(
        stream_response(), media_type="application/ndjson", headers=headers
    )


@app.get("/thumbnail/{path:path}")
async def get_thumbnail(path: str):
    image_path = utils.resolve_path(path, ROOT_DIR)

    thumbnail_data = await data_source.get_thumbnail(image_path)
    return Response(
        thumbnail_data,
        media_type="image/webp",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


@app.get("/preview/{path:path}")
async def get_preview(path: str):
    image_path = utils.resolve_path(path, ROOT_DIR)

    preview_data = await data_source.get_preview(image_path)
    return Response(
        preview_data,
        media_type="image/webp",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


@app.get("/download/{path:path}")
async def download_image(path: str):
    try:
        image_path = utils.resolve_path(path, ROOT_DIR)

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
        image_path = utils.resolve_path(path, ROOT_DIR)

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

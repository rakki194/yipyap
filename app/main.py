import asyncio
from pathlib import Path
import logging
import os

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from email.utils import parsedate_to_datetime, format_datetime

from .data_access import CachedFileSystemDataSource
from . import utils

logger = logging.getLogger("uvicorn.error")

# Move environment detection to top, before app creation
is_dev = os.getenv("ENVIRONMENT", "development").lower() == "development"
logger.info(f"Starting server in {'development' if is_dev else 'production'} mode")

app = FastAPI()


if is_dev:
    dev_port = int(os.getenv("DEV_PORT", "1984"))
    logger.info(f"Allowing CORS requests from http://localhost:{dev_port}")

    # Development-only middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[f"http://localhost:{dev_port}"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Vite should handle the static files
else:
    # Production-only: serve the built frontend assets
    logger.info("Mounting production static files from /dist/")
    app.mount("/static", StaticFiles(directory="static"), name="static")
    # mount /assets for Vite's bundled files
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")


# Initialize data source
ROOT_DIR = Path(os.getenv("ROOT_DIR", Path.cwd())).resolve()
THUMBNAIL_SIZE = (300, 300)
PREVIEW_SIZE = (1024, 1024)
data_source = CachedFileSystemDataSource(ROOT_DIR, THUMBNAIL_SIZE, PREVIEW_SIZE)


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


# Used for deleting everything in a directory.
@app.delete("/api/browse/{path:path}")
async def delete_image(path: str, confirm: bool = Query(False)):
    image_path = utils.resolve_path(path, ROOT_DIR)
    deleted_suffixes = await data_source.delete_image(image_path, confirm)
    return {"confirm": confirm, "deleted_suffixes": deleted_suffixes}


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
async def update_caption(path: str, caption_data: dict):
    """Update caption file content for an image"""
    try:
        image_path = utils.resolve_path(path, ROOT_DIR)
        caption_type = caption_data.get("type")
        caption_text = caption_data.get("caption")

        if not caption_type or not caption_text:
            raise HTTPException(status_code=400, detail="Missing caption type or text")

        await data_source.save_caption(image_path, caption_text, caption_type)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/config")
async def get_config():
    """Endpoint to get the configured preview and thumbnail sizes."""
    return {
        "thumbnail_size": data_source.thumbnail_size,
        "preview_size": data_source.preview_size,
    }


# Used for deleting a single caption file.
@app.delete("/api/caption/{path:path}")
async def delete_caption(path: str, caption_type: str = Query(...)):
    """Delete a caption file for an image"""
    try:
        logger.info(f"Attempting to delete caption: path={path}, type={caption_type}")
        image_path = utils.resolve_path(path, ROOT_DIR)
        logger.info(f"Resolved path: {image_path}")

        # Log the full path and check if file exists before deletion
        caption_path = image_path.with_suffix(f".{caption_type}")
        logger.info(f"Caption path to delete: {caption_path}")
        logger.info(f"File exists before deletion: {caption_path.exists()}")

        await data_source.delete_caption(image_path, caption_type)

        # Verify deletion
        exists_after = caption_path.exists()
        logger.info(f"File exists after deletion attempt: {exists_after}")

        if exists_after:
            raise HTTPException(
                status_code=500,
                detail=f"File still exists after deletion attempt: {caption_path}",
            )

        return {
            "success": True,
            "message": f"Caption {caption_type} deleted successfully",
            "path": str(caption_path),
        }
    except FileNotFoundError as e:
        logger.error(f"File not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error deleting caption: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/folders")
async def get_all_folders():
    """Get all folders recursively from ROOT_DIR"""
    try:
        folders = []

        def scan_directory(current_path: Path, relative_to: Path):
            try:
                # Skip hidden directories
                if current_path.name.startswith("."):
                    return

                # Get relative path for the response
                rel_path = str(current_path.relative_to(relative_to))
                if rel_path != ".":  # Don't include the root itself
                    folders.append(
                        {
                            "name": current_path.name,
                            "path": str(current_path.parent.relative_to(ROOT_DIR)),
                            "fullPath": rel_path,
                        }
                    )

                # Recursively scan subdirectories
                for item in current_path.iterdir():
                    if item.is_dir() and not item.name.startswith("."):
                        scan_directory(item, relative_to)
            except (PermissionError, OSError) as e:
                logger.warning(f"Could not scan directory {current_path}: {e}")

        # Start recursive scan from ROOT_DIR
        scan_directory(ROOT_DIR, ROOT_DIR)

        # Sort folders by path for consistent results
        folders.sort(key=lambda x: x["fullPath"])

        return {"folders": folders, "root": str(ROOT_DIR)}

    except Exception as e:
        logger.error(f"Error scanning folders: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.middleware("http")
async def serve_spa(request: Request, call_next):
    response = await call_next(request)

    print("serve_spa", request.url.path)
    if (
        not is_dev
        and response.status_code == 404
        and not request.url.path.startswith(
            (
                "/api/",
                "/assets/",
                "/static/",
                "/config",
                "/preview/",
                "/thumbnail/",
                "/download/",
                "/caption/",
            )
        )
    ):
        logger.debug(f"Serving SPA for path: {request.url.path}")
        return FileResponse("dist/index.html")

    return response

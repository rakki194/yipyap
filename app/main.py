"""
FastAPI backend for yipyap image browser and caption management system.

This module provides the core HTTP endpoints for browsing, viewing, and managing images
and their associated captions. It handles file operations, image processing, caption
generation, and serves both the API endpoints and static files.

Key features:
- Directory browsing with pagination and caching
- Image thumbnail and preview generation
- Caption management (create, update, delete)
- Multiple caption generator support (JTP2, WDv3)
- File upload and deletion
- Development/Production mode handling
- Static file serving
- SPA (Single Page Application) support

Environment Variables:
    ENVIRONMENT (str): "development" or "production" (default: "development")
    DEV_PORT (int): Development server port (default: 1984)
    ROOT_DIR (Path): Root directory for file operations (default: current working directory)
    JTP2_MODEL_PATH (Path): Path to JTP2 model file
    JTP2_TAGS_PATH (Path): Path to JTP2 tags file
    WDV3_MODEL_NAME (str): WDv3 model name (default: "vit")
    WDV3_GEN_THRESHOLD (float): General threshold for WDv3 (default: 0.35)
    WDV3_CHAR_THRESHOLD (float): Character threshold for WDv3 (default: 0.75)
"""

import asyncio
from pathlib import Path
import logging
import os
import json
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Query, Request, File, UploadFile, Body
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from email.utils import parsedate_to_datetime, format_datetime
from typing import List, Dict, Any
import shutil
import aiofiles

from .data_access import CachedFileSystemDataSource
from . import utils
from . import caption_generation

MODEL_REPO_MAP = {
    "vit": "SmilingWolf/wd-v1-4-vit-tagger-v2",
    "swinv2": "SmilingWolf/wd-v1-4-swinv2-tagger-v2",
    "convnext": "SmilingWolf/wd-v1-4-convnext-tagger-v2",
}

logger = logging.getLogger("uvicorn.error")

is_dev = os.getenv("ENVIRONMENT", "production").lower() == "development"
logger.info(f"Starting server in {'development' if is_dev else 'production'} mode")

# Paths for tag autocompletion
FLORENCE2_BASE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "caption_generation/plugins/florence2/florence2_implementation",
)
JTP2_BASE_PATH = os.path.expanduser(os.getenv("JTP2_PATH", "~/source/repos/JTP2"))

app = FastAPI()

# Create logs directory if it doesn't exist
logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

# Get the frontend logger from the logging system
frontend_logger = logging.getLogger("frontend")


async def serve_spa(request: Request, call_next):
    response = await call_next(request)
    if response.status_code != 404:
        return response

    # Check if the request is for HTML content, and not for API or static files
    accept_header = request.headers.get("accept", "")
    if "text/html" not in accept_header or request.url.path.startswith(
        (
            "/api/",
            "/preview/",
            "/thumbnail/",
            "/download/",
            "/assets/",
        )
    ):
        return response

    logger.debug(f"Serving SPA root for path: {request.url.path}")
    return FileResponse("dist/index.html")


if not is_dev:
    # Production-only: serve the built frontend assets
    logger.info("Mounting production static files from /dist/")
    # mount /assets for Vite's bundled files
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    # Serve the SPA for production
    app.add_middleware(BaseHTTPMiddleware, dispatch=serve_spa)

# Initialize data source
ROOT_DIR = Path(os.getenv("ROOT_DIR", Path.cwd())).resolve()
THUMBNAIL_SIZE = (300, 300)
PREVIEW_SIZE = (1024, 1024)
data_source = CachedFileSystemDataSource(ROOT_DIR, THUMBNAIL_SIZE, PREVIEW_SIZE)

# Add this constant near the top of the file with other constants
CAPTION_TYPE_ORDER = {".e621": 0, ".tags": 1, ".wd": 2, ".caption": 3}

# Add configuration near other constants
JTP2_MODEL_PATH = Path(
    os.getenv(
        "JTP2_MODEL_PATH",
        "/home/kade/source/repos/JTP2/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors",
    )
)
JTP2_TAGS_PATH = Path(
    os.getenv("JTP2_TAGS_PATH", "/home/kade/source/repos/JTP2/tags.json")
)

# Add near other constants
WDV3_MODEL_NAME = os.getenv("WDV3_MODEL_NAME", "vit")
WDV3_GEN_THRESHOLD = float(os.getenv("WDV3_GEN_THRESHOLD", "0.35"))
WDV3_CHAR_THRESHOLD = float(os.getenv("WDV3_CHAR_THRESHOLD", "0.75"))

# Add near other constants
JTP2_THRESHOLD = float(os.getenv("JTP2_THRESHOLD", "0.2"))
JTP2_FORCE_CPU = os.getenv("JTP2_FORCE_CPU", "false").lower() == "true"

# Import caption manager when needed - lazy loading
# This allows the application to start even if caption dependencies are missing
logger.info("Caption generator plugins will be loaded on demand")


@app.get("/api/browse")
async def browse(
    request: Request,
    path: str = "",
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1),
):
    """
    Browse directory contents with pagination and caching support.

    Args:
        request (Request): FastAPI request object for header access
        path (str): Relative path to browse from ROOT_DIR
        page (int): Page number for pagination (>= 1)
        page_size (int): Number of items per page (>= 1)

    Returns:
        StreamingResponse: NDJSON stream of directory contents
            First line: BrowseHeader with directory metadata
            Subsequent lines: DirectoryModel or ImageModel objects

    Raises:
        HTTPException: If path not found or other errors occur
    """
    try:
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
            "Cache-Control": "public, max-age=0",
        }

        # If items is None, it means we should return 304 Not Modified
        if items is None and if_modified_since:
            logger.info(f"304 Not Modified: {path}:{page} {last_modified}")
            return Response(status_code=304, headers=headers)

        # For HEAD requests, return just the header
        if is_head:
            return Response(
                content=browser_header.model_dump_json(),
                media_type="application/json",
                headers=headers,
            )

        async def stream_response():
            yield f"{browser_header.model_dump_json()}\n"

            # Sort items that have captions
            for item in items:
                if hasattr(item, "captions"):
                    item.captions.sort(
                        key=lambda x: CAPTION_TYPE_ORDER.get(f".{x[0]}", 999)
                    )
                yield f"{item.model_dump_json()}\n"

            # Process futures
            for future in asyncio.as_completed(futures):
                res = await future
                if hasattr(res, "captions"):
                    res.captions.sort(
                        key=lambda x: CAPTION_TYPE_ORDER.get(f".{x[0]}", 999)
                    )
                yield f"{res.model_dump_json()}\n"

        return StreamingResponse(
            stream_response(), media_type="application/ndjson", headers=headers
        )
    except FileNotFoundError:
        logger.error(f"Path not found: {path}")
        raise HTTPException(status_code=404, detail="Path not found")
    except Exception as e:
        logger.error(f"Error browsing path {path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Used for deleting everything in a directory.
@app.delete("/api/browse/{path:path}")
async def delete_image(
    path: str,
    confirm: bool = Query(True),
    preserve_latents: bool = Query(False),
    preserve_txt: bool = Query(False),
):
    """
    Delete an image/directory and its associated files.

    Args:
        path (str): Path to the image/directory to delete
        confirm (bool): Whether to actually perform the deletion (default: True)
        preserve_latents (bool): Whether to preserve .npz files
        preserve_txt (bool): Whether to preserve .txt files
    """
    target_path = utils.resolve_path(path, ROOT_DIR)
    try:
        logger.info(f"Deleting {target_path} (confirm={confirm})")
        captions, files, preserved = await data_source.delete_image(
            target_path,
            confirm=confirm,
            preserve_latents=preserve_latents,
            preserve_txt=preserve_txt,
        )
        return {
            "confirm": confirm,
            "deleted_captions": captions,
            "deleted_files": files,
            "preserved_files": preserved,
        }
    except Exception as e:
        logger.error(f"Error deleting {target_path}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/thumbnail/{path:path}")
async def get_thumbnail(path: str):
    """
    Get a cached thumbnail for an image.

    Args:
        path (str): Path to the original image

    Returns:
        Response: WebP thumbnail image with caching headers

    Notes:
        - Thumbnails are 300x300 max size
        - Uses SQLite cache for storing thumbnails
        - Cache-Control header set for 1 year
    """
    image_path = utils.resolve_path(path, ROOT_DIR)

    thumbnail_data = await data_source.get_thumbnail(image_path)
    return Response(
        thumbnail_data,
        media_type="image/webp",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


@app.get("/preview/{path:path}")
async def get_preview(path: str):
    """
    Get a preview-sized version of an image.

    Args:
        path (str): Path to the original image

    Returns:
        Response: WebP preview image with caching headers

    Notes:
        - Previews are 1024x1024 max size
        - Uses SQLite cache for storing previews
        - Cache-Control header set for 1 year
    """
    image_path = utils.resolve_path(path, ROOT_DIR)

    preview_data = await data_source.get_preview(image_path)
    return Response(
        preview_data,
        media_type="image/webp",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


@app.get("/download/{path:path}")
async def download_image(path: str):
    """
    Download the original image file.

    Args:
        path (str): Path to the image file

    Returns:
        FileResponse: Original image file as attachment

    Raises:
        HTTPException: If file not found or access denied
    """
    try:
        image_path = utils.resolve_path(path, ROOT_DIR)

        return FileResponse(
            image_path,
            filename=image_path.name,
            headers={"Cache-Control": "public, max-age=31536000"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/config")
async def get_config():
    """
    Get application configuration settings.

    Returns:
        dict: Configuration settings
            - thumbnail_size (tuple): Max width/height for thumbnails
            - preview_size (tuple): Max width/height for previews
    """
    return {
        "thumbnail_size": data_source.thumbnail_size,
        "preview_size": data_source.preview_size,
    }


@app.put("/api/config/thumbnail_size")
async def update_thumbnail_size(size: int):
    """Update thumbnail size configuration."""
    if size < 100 or size > 500:
        raise HTTPException(status_code=400, detail="Invalid thumbnail size")

    # Update the thumbnail size
    data_source.set_thumbnail_size((size, size))

    # Clear thumbnail cache to regenerate with new size
    data_source.clear_thumbnail_cache()

    return {"success": True}


@app.put("/api/caption/{path:path}")
async def update_caption(path: str, caption_data: dict):
    """
    Create or update a caption file for an image.

    Args:
        path (str): Path to the image file
        caption_data (dict): Caption information
            - type (str): Caption file type (e.g., "caption", "tags")
            - caption (str): Caption text content

    Returns:
        dict: Success status

    Raises:
        HTTPException: If image not found or caption update fails

    Notes:
        - Creates caption file with same name as image but different extension
        - Updates cache through data_source
        - Touches parent directory to force cache invalidation
    """
    try:
        image_path = utils.resolve_path(path, ROOT_DIR)
        if not image_path.exists():
            raise HTTPException(
                status_code=404, detail=f"Image not found: {image_path}"
            )

        caption_type = caption_data.get("type")
        caption_text = caption_data.get("caption", "")

        if not caption_type:
            raise HTTPException(status_code=400, detail="Missing caption type")

        # Create the caption file
        caption_path = image_path.with_suffix(f".{caption_type}")

        # Write the caption text
        async with aiofiles.open(caption_path, "w", encoding="utf-8") as f:
            await f.write(str(caption_text))

        # Touch the parent directory to force cache invalidation
        image_path.touch()

        # Update the cache through data_source
        await data_source.save_caption(image_path, str(caption_text), caption_type)

        return {"success": True}

    except Exception as e:
        logger.error(f"Error saving caption: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/caption/{path:path}")
async def delete_caption(path: str, caption_type: str = Query(...)):
    """Delete a caption file for an image"""
    try:
        logger.info(f"Attempting to delete caption: path={path}, type={caption_type}")
        image_path = utils.resolve_path(path, ROOT_DIR)
        logger.info(f"Resolved path: {image_path}")

        caption_path = image_path.with_suffix(f".{caption_type}")
        logger.info(f"Caption path to delete: {caption_path}")

        try:
            caption_path.unlink(missing_ok=True)
            # Touch the parent directory to force cache invalidation
            image_path.touch()

            return {
                "success": True,
                "message": f"Caption {caption_type} deleted successfully",
                "path": str(caption_path),
            }
        except PermissionError as e:
            logger.error(f"Permission error deleting file: {e}")
            raise HTTPException(status_code=403, detail="Permission denied")

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


@app.get("/api/captioners")
async def get_captioners():
    """
    Get information about all available captioners.

    Returns:
        dict: Dictionary of captioner information indexed by name

    Each captioner entry contains:
    - name: Unique identifier
    - description: Human-readable description
    - version: Version information
    - caption_type: Type of captions produced
    - features: List of supported features
    - config_schema: JSON Schema for configuration options
    """
    from app.caption_generation import captioner_manager

    return captioner_manager.get_available_captioners()


@app.put("/api/captioner-config/{name}")
async def update_captioner_config(name: str, config: dict):
    """
    Update a captioner's configuration.

    Args:
        name (str): Name of the captioner to update
        config (dict): New configuration values

    Returns:
        dict: Success status

    Raises:
        HTTPException: If captioner not found or update fails
    """
    from app.caption_generation import captioner_manager

    if not captioner_manager.update_captioner_config(name, config):
        raise HTTPException(
            status_code=400,
            detail=f"Unknown caption generator: {name}",
        )

    return {"success": True}


@app.post("/api/generate-caption/{path:path}")
async def generate_caption(
    path: str,
    generator: str = Query(...),
    force: bool = Query(False),
):
    """Generate caption for an image.

    The path parameter can be either:
    - "_/image.png" for root directory images
    - "subdir/image.png" for subdirectory images
    """
    try:
        from app.caption_generation import captioner_manager

        captioner = captioner_manager.get_captioner(generator)
        if not captioner:
            available = captioner_manager.get_captioner_names()
            raise HTTPException(
                status_code=400,
                detail=f"Unknown caption generator: {generator}. Available generators: {available}",
            )

        # Handle root directory case
        if path.startswith("_/"):
            path = path[2:]  # Remove "_/" prefix

        # Construct full image path
        image_path = utils.resolve_path(path, ROOT_DIR)
        if not image_path.exists():
            raise HTTPException(
                status_code=404, detail=f"Image not found: {image_path}"
            )

        # Check if caption already exists
        caption_path = image_path.with_suffix(f".{captioner.caption_type}")
        if not force and caption_path.exists():
            raise HTTPException(
                status_code=400, detail=f"Caption already exists: {caption_path}"
            )

        # Generate caption
        try:
            caption = await captioner.generate(image_path)
        except Exception as e:
            logger.error(
                f"Error generating caption with {generator}: {e}", exc_info=True
            )
            raise HTTPException(
                status_code=500,
                detail=f"Error generating caption with {generator}: {str(e)}",
            )

        # Save caption
        await data_source.save_caption(image_path, caption, captioner.caption_type)

        return {"success": True, "caption": caption}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating caption: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/jtp2-config")
async def update_jtp2_config(config: dict):
    """
    Update JTP2 model configuration.

    Args:
        config (dict): New configuration settings
            - model_path (str, optional): Path to model file
            - tags_path (str, optional): Path to tags file
            - threshold (float, optional): Confidence threshold for tags
            - force_cpu (bool, optional): Whether to force CPU usage

    Returns:
        dict: Success status

    Raises:
        HTTPException: If reinitialization fails

    Deprecated:
        Use /api/captioner-config/jtp2 instead
    """
    global JTP2_MODEL_PATH, JTP2_TAGS_PATH, JTP2_THRESHOLD, JTP2_FORCE_CPU

    # Update global variables for backward compatibility
    if "model_path" in config:
        JTP2_MODEL_PATH = Path(config["model_path"])
    if "tags_path" in config:
        JTP2_TAGS_PATH = Path(config["tags_path"])
    if "threshold" in config:
        threshold = float(config["threshold"])
        if not 0 <= threshold <= 1:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid threshold: {threshold}. Must be between 0 and 1",
            )
        JTP2_THRESHOLD = threshold
    if "force_cpu" in config:
        JTP2_FORCE_CPU = bool(config["force_cpu"])

    # Update the captioner using the new system
    try:
        from app.caption_generation import captioner_manager

        success = captioner_manager.update_captioner_config("jtp2", config)
        if not success:
            logger.warning("JTP2 captioner not available in the plugin system")

        logger.info("JTP2 configuration updated")
        return {"success": True}
    except Exception as e:
        logger.error(f"Failed to update JTP2 configuration: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload/{path:path}")
async def upload_files(path: str, files: List[UploadFile] = File(...)):
    """
    Upload files to a specified directory.

    Args:
        path (str): Target directory path
        files (List[UploadFile]): List of files to upload

    Returns:
        dict: Upload status message

    Raises:
        HTTPException: If upload fails

    Notes:
        - Creates target directory if it doesn't exist
        - Preserves relative paths in uploaded files
        - Skips hidden files
    """
    try:
        # Resolve the target directory path using utils.resolve_path
        target_dir = utils.resolve_path(path, ROOT_DIR) if path else ROOT_DIR

        if not target_dir.exists():
            target_dir.mkdir(parents=True, exist_ok=True)

        uploaded_files = []
        failed_files = []

        for file in files:
            try:
                # Get the relative path from the file name/path
                relative_path = file.filename
                if not relative_path:
                    continue

                # Skip hidden files and directories
                if any(part.startswith(".") for part in Path(relative_path).parts):
                    continue

                # Create full target path
                full_path = target_dir / relative_path

                # Ensure the parent directory exists
                full_path.parent.mkdir(parents=True, exist_ok=True)

                # Save the file
                async with aiofiles.open(full_path, "wb") as buffer:
                    while content := await file.read(8192):  # Read in 8KB chunks
                        await buffer.write(content)

                uploaded_files.append(relative_path)

            except Exception as e:
                logger.error(f"Error uploading file {file.filename}: {e}")
                failed_files.append(file.filename)
                continue

        # Touch the directory to force cache update
        target_dir.touch()

        # Clear directory cache
        if target_dir in data_source.directory_cache:
            del data_source.directory_cache[target_dir]

        result = {
            "message": "Upload complete",
            "uploaded": uploaded_files,
            "failed": failed_files,
        }

        if failed_files:
            result["error"] = "Some files failed to upload"

        return result

    except Exception as e:
        logger.error(f"Error uploading files: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload")
async def upload_files_root(files: List[UploadFile] = File(...)):
    """
    Upload files to the root directory.

    Args:
        files (List[UploadFile]): List of files to upload

    Returns:
        dict: Upload status message

    Notes:
        - Wrapper around upload_files with empty path
    """
    return await upload_files("", files)


@app.post("/api/folder/{path:path}")
async def create_folder(path: str):
    """Create a new folder at the specified path."""
    try:
        target_path = utils.resolve_path(path, ROOT_DIR)

        # Check if folder already exists
        if target_path.exists():
            raise HTTPException(
                status_code=400, detail=f"Folder already exists: {path}"
            )

        # Create the folder
        target_path.mkdir(parents=True, exist_ok=False)

        # Touch parent directory to force cache invalidation
        target_path.parent.touch()

        # Clear directory cache to force rescan
        if target_path.parent in data_source.directory_cache:
            del data_source.directory_cache[target_path.parent]

        return {"success": True, "path": str(target_path)}

    except Exception as e:
        logger.error(f"Error creating folder: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/move/{path:path}")
async def move_items(
    path: str,
    target: str = Query(..., description="Target directory path"),
    items: List[str] = Body(..., description="List of items to move"),
    preserve_latents: bool = Body(False, description="Whether to preserve .npz files"),
    preserve_txt: bool = Body(False, description="Whether to preserve .txt files"),
):
    """
    Move files and folders to a target directory.

    Args:
        path (str): Current directory path (empty string for root directory)
        target (str): Target directory path
        items (List[str]): List of items to move
        preserve_latents (bool): Whether to preserve .npz files
        preserve_txt (bool): Whether to preserve .txt files
    """
    try:
        # Use ROOT_DIR for empty path, otherwise resolve the path
        source_dir = ROOT_DIR if not path else utils.resolve_path(path, ROOT_DIR)
        target_dir = utils.resolve_path(target, ROOT_DIR)

        logger.info(f"Moving items from {source_dir} to {target_dir}")
        logger.info(f"Items to move: {items}")
        logger.info(
            f"Preserve settings: latents={preserve_latents}, txt={preserve_txt}"
        )

        # Ensure target directory exists
        target_dir.mkdir(parents=True, exist_ok=True)

        moved_items = []
        failed_items = []
        failed_reasons = {}

        for item in items:
            try:
                source_path = source_dir / item
                target_path = target_dir / item

                logger.info(f"Moving {source_path} to {target_path}")

                # Skip if source doesn't exist or target already exists
                if not source_path.exists():
                    logger.error(f"Source does not exist: {source_path}")
                    failed_items.append(item)
                    failed_reasons[item] = "source_missing"
                    continue
                if target_path.exists():
                    logger.error(f"Target already exists: {target_path}")
                    failed_items.append(item)
                    failed_reasons[item] = "target_exists"
                    continue

                if source_path.is_dir():
                    # Move directory and all contents
                    shutil.move(str(source_path), str(target_path))
                    moved_items.append(item)
                else:
                    # Move file and associated files (captions, etc)
                    stem = source_path.stem
                    for f in source_path.parent.glob(f"{stem}*"):
                        # Skip latents/txt files if not preserving them
                        if (not preserve_latents and f.suffix == ".npz") or (
                            not preserve_txt and f.suffix == ".txt"
                        ):
                            continue
                        logger.info(
                            f"Moving associated file: {f} to {target_dir / f.name}"
                        )
                        shutil.move(str(f), str(target_dir / f.name))
                    moved_items.append(item)

            except Exception as e:
                logger.error(f"Failed to move {item}: {e}")
                failed_items.append(item)
                failed_reasons[item] = "error"

        # Touch directories to force cache update
        source_dir.touch()
        target_dir.touch()

        # Clear cache for affected directories
        if source_dir in data_source.directory_cache:
            del data_source.directory_cache[source_dir]
        if target_dir in data_source.directory_cache:
            del data_source.directory_cache[target_dir]

        result = {
            "success": True,
            "moved": moved_items,
            "failed": failed_items,
            "failed_reasons": failed_reasons,
        }
        logger.info(f"Move operation result: {result}")
        return result

    except Exception as e:
        logger.error(f"Error moving items: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/wdv3-config")
async def update_wdv3_config(config: dict):
    """
    Update WDv3 model configuration.

    Args:
        config (dict): Configuration parameters
            - model_name (str, optional): Model architecture ("vit", "swinv2", "convnext")
            - gen_threshold (float, optional): General tag threshold
            - char_threshold (float, optional): Character tag threshold

    Returns:
        dict: Success status

    Raises:
        HTTPException: If update fails

    Deprecated:
        Use /api/captioner-config/wdv3 instead
    """
    try:
        # Validate parameters
        if "model_name" in config:
            if config["model_name"] not in MODEL_REPO_MAP:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid model name: {config['model_name']}. Available models: {list(MODEL_REPO_MAP.keys())}",
                )
            os.environ["WDV3_MODEL_NAME"] = config["model_name"]

        if "gen_threshold" in config:
            gen_threshold = float(config["gen_threshold"])
            if not 0 <= gen_threshold <= 1:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid general threshold: {gen_threshold}. Must be between 0 and 1",
                )
            os.environ["WDV3_GEN_THRESHOLD"] = str(gen_threshold)

        if "char_threshold" in config:
            char_threshold = float(config["char_threshold"])
            if not 0 <= char_threshold <= 1:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid character threshold: {char_threshold}. Must be between 0 and 1",
                )
            os.environ["WDV3_CHAR_THRESHOLD"] = str(char_threshold)

        # Update the captioner using the new system
        try:
            from app.caption_generation import captioner_manager

            success = captioner_manager.update_captioner_config("wdv3", config)
            if not success:
                logger.warning("WDv3 captioner not available in the plugin system")

            logger.info("WDv3 configuration updated")
            return {
                "success": True,
                "message": "WDv3 configuration updated successfully",
            }
        except Exception as e:
            logger.error(f"Failed to update WDv3 configuration: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating WDv3 config: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/favorite/{path:path}")
async def update_favorite_state(path: str, config: dict = Body(...)):
    """Update the favorite state of an image."""
    try:
        # Extract and validate favorite state from request body
        if "favorite_state" not in config:
            raise HTTPException(
                status_code=400, detail="Missing favorite_state in request body"
            )

        try:
            favorite_state = int(config["favorite_state"])
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=400, detail="favorite_state must be an integer"
            )

        # Validate favorite state range
        if not 0 <= favorite_state <= 6:
            raise HTTPException(status_code=400, detail="Invalid favorite state")

        # Get the full path
        full_path = utils.resolve_path(path, ROOT_DIR)
        if not full_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")

        # Update favorite state in SQLite
        conn = data_source._get_connection()
        directory = str(full_path.parent)
        filename = full_path.name

        # Update both the favorite_state column and the info JSON
        result = conn.execute(
            "SELECT info FROM image_info WHERE directory = ? AND name = ?",
            (directory, filename),
        ).fetchone()

        if result:
            info = json.loads(result[0])
            info["favorite_state"] = favorite_state

            conn.execute(
                """
                UPDATE image_info 
                SET favorite_state = ?, info = ?, cache_time = ?
                WHERE directory = ? AND name = ?
                """,
                (
                    favorite_state,
                    json.dumps(info),
                    int(datetime.now(timezone.utc).timestamp()),
                    directory,
                    filename,
                ),
            )
            conn.commit()

            # Clear directory cache to force reload
            data_source.directory_cache.pop(full_path.parent, None)

            return {"success": True}
        else:
            raise HTTPException(status_code=404, detail="Image info not found in cache")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating favorite state for {path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/florence2-config", tags=["generation"], deprecated=True)
async def update_florence2_config(config: Dict[str, Any]):
    """
    Update Florence2 model configuration.

    This updates the Florence2 captioner configuration with new parameters.

    Args:
        config (Dict[str, Any]): Configuration parameters for Florence2.
            - script_path (str, optional): Path to the Florence2 script.
            - use_gpu (bool, optional): Whether to use GPU for inference.
            - precision (str, optional): Precision for model inference (fp16/fp32).
            - max_tokens (int, optional): Maximum number of tokens in generated caption.

    Returns:
        Dict[str, Any]: Status indicating success

    Raises:
        HTTPException: If the configuration could not be updated

    Note:
        This endpoint is deprecated. Please use /api/captioner-config/florence2 instead.
    """
    try:
        # Update environment variables for backward compatibility
        if "script_path" in config:
            os.environ["FLORENCE2_PATH"] = config["script_path"]

        # Validate parameters
        if "max_tokens" in config and config["max_tokens"] < 1:
            raise ValueError("max_tokens must be greater than 0")

        if "precision" in config and config["precision"] not in ["fp16", "fp32"]:
            raise ValueError("precision must be one of: fp16, fp32")

        if "use_gpu" in config:
            os.environ["FLORENCE2_FORCE_CPU"] = str(not config["use_gpu"]).lower()

        if "precision" in config:
            os.environ["FLORENCE2_PRECISION"] = config["precision"]

        if "max_tokens" in config:
            os.environ["FLORENCE2_MAX_TOKENS"] = str(config["max_tokens"])

        # Update the configuration through the captioner manager
        from app.caption_generation import captioner_manager

        await captioner_manager.update_captioner_config("florence2", config)

        return {"status": "success"}
    except Exception as e:
        logger.error(f"Failed to update Florence2 configuration: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update Florence2 configuration: {e}"
        )


@app.put("/api/joycaption-config", tags=["generation"], deprecated=True)
async def update_joycaption_config(config: Dict[str, Any]):
    """
    Update JoyCaptioner model configuration.

    This updates the JoyCaptioner configuration with new parameters.

    Args:
        config (Dict[str, Any]): Configuration parameters for JoyCaptioner.
            - script_path (str, optional): Path to the JoyCaptioner script.
            - model_path (str, optional): Path to the JoyCaptioner model.
            - caption_type (str, optional): Type of caption to generate.
            - length (str, optional): Length of caption ('short', 'medium', 'long').
            - force_cpu (bool, optional): Whether to force CPU inference.

    Returns:
        Dict[str, Any]: Status indicating success

    Raises:
        HTTPException: If the configuration could not be updated

    Note:
        This endpoint is deprecated. Please use /api/captioner-config/joycaption instead.
    """
    try:
        # Update environment variables for backward compatibility
        if "script_path" in config:
            os.environ["JOYCAPTION_PATH"] = config["script_path"]

        if "model_path" in config:
            os.environ["JOYCAPTION_MODEL_PATH"] = config["model_path"]

        # Validate parameters
        if "caption_type" in config and config["caption_type"] not in [
            "emotional",
            "detailed",
            "simple",
        ]:
            raise ValueError("caption_type must be one of: emotional, detailed, simple")

        if "length" in config and config["length"] not in ["short", "medium", "long"]:
            raise ValueError("length must be one of: short, medium, long")

        # Update the configuration through the captioner manager
        from app.caption_generation import captioner_manager

        await captioner_manager.update_captioner_config("joycaption", config)

        return {"status": "success"}
    except Exception as e:
        logger.error(f"Failed to update JoyCaptioner configuration: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to update JoyCaptioner configuration: {e}"
        )


@app.get("/api/captioner-config/{name}")
async def get_captioner_config(name: str):
    """
    Get a captioner's current configuration.

    Args:
        name (str): Name of the captioner

    Returns:
        dict: Captioner configuration

    Raises:
        HTTPException: If captioner not found
    """
    from app.caption_generation import captioner_manager

    config = captioner_manager.get_captioner_config(name)
    if config is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown caption generator: {name}",
        )

    return config


@app.get("/api/debug/routes")
async def list_routes():
    """List all mounted routes for debugging"""
    routes = []

    # Add routes from FastAPI router
    for route in app.routes:
        routes.append(
            {
                "path": getattr(route, "path", ""),
                "name": getattr(route, "name", ""),
                "methods": getattr(route, "methods", []),
            }
        )

    # Add mounted static paths
    for name, mount in app.routes[0].app.named_middleware.items():
        if hasattr(mount, "directory"):
            routes.append(
                {
                    "path": f"/{name}",
                    "type": "static",
                    "directory": str(mount.directory),
                }
            )

    return routes


LEVEL_MAP = logging.getLevelNamesMapping()


@app.post("/api/log")
async def log_frontend_messages(request: Request):
    """
    Endpoint to receive and store logs from the frontend.

    Stores logs in a dedicated frontend.log file that rotates daily.
    Each log entry is a JSON object containing:
    - timestamp: ISO format timestamp
    - level: Log level (DEBUG, INFO, WARN, ERROR)
    - message: Formatted message string
    - args: Original arguments passed to the logger
    - error: Optional error object with message and stack trace
    - callSite: Optional call site information (file, line, column)
    """
    try:
        log_data = await request.json()
        logs = log_data.get("logs", [])

        if not logs:
            return {"status": "error", "message": "No logs provided"}

        # Process each log entry
        for entry in logs:
            # Skip empty entries
            if not entry:
                continue

            # Get log level from the entry
            level_name = entry.get("level", "INFO")
            level = LEVEL_MAP.get(level_name, logging.INFO)
            if not frontend_logger.isEnabledFor(level):
                continue

            # Get message and args
            message = entry.get("message", "")
            args = entry.get("args", [])

            # Format message with args if present
            if args:
                # Handle template literals like console methods
                if "%" in message:
                    try:
                        message = message % args
                    except (TypeError, ValueError):
                        # If template formatting fails, append args as is
                        message = f"{message} {' '.join(str(arg) for arg in args)}"
                else:
                    # If no template, append args
                    message = f"{message} {' '.join(str(arg) for arg in args)}"

            # Add call site information if present
            call_site = entry.get("callSite")
            if call_site:
                message = f"[{call_site['file']}:{call_site['line']}:{call_site['column']}] {message}"

            # If there's an error object, include its details
            error = entry.get("error")
            if error:
                error_msg = f"Error: {error.get('message', '')}"
                if error.get("stack"):
                    error_msg += f"\nStack trace:\n{error['stack']}"
                message = f"{message}\n{error_msg}"

            frontend_logger._log(level, message, (), {})

        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error processing frontend logs: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/api/tags/autocomplete")
async def get_tag_suggestions(q: str, limit: int = 10):
    """Get tag suggestions based on a query string."""
    logger.info(f"Getting tag suggestions for query: '{q}'")

    # Define the two potential tags files
    florence2_tags_file = os.path.join(FLORENCE2_BASE_PATH, "tags.json")
    jtp2_tags_file = os.path.join(JTP2_BASE_PATH, "tags.json")

    # Use Florence2 tags if available, otherwise try JTP2 tags
    if os.path.exists(florence2_tags_file):
        tags_file = florence2_tags_file
        logger.info(f"Using Florence2 tags file: {florence2_tags_file}")
    elif os.path.exists(jtp2_tags_file):
        tags_file = jtp2_tags_file
        logger.info(f"Using JTP2 tags file: {jtp2_tags_file}")
    else:
        logger.warning("No tags file found for autocomplete")
        return {"suggestions": []}

    try:
        # Load the tags
        with open(tags_file, "r", encoding="utf-8") as f:
            tags_data = json.load(f)

        # Extract tag names based on the structure of the JSON file
        # Florence2 tags have a specific structure
        if "categories" in tags_data:
            # Florence2 tags structure
            all_tags = []
            for category in tags_data["categories"]:
                for tag in category["tags"]:
                    all_tags.append(tag["name"])
        else:
            # JTP2 or simple tags list
            all_tags = tags_data

        logger.info(f"Loaded {len(all_tags)} tags from {os.path.basename(tags_file)}")

        # Filter tags by the query (case insensitive)
        q = q.lower()
        logger.info(f"Filtering tags with query: '{q}'")

        # First get tags that start with the query
        starts_with = [tag for tag in all_tags if tag.lower().startswith(q)]
        logger.info(f"Found {len(starts_with)} tags that start with '{q}'")

        # Then get tags that contain the query but don't start with it
        contains = [
            tag
            for tag in all_tags
            if q in tag.lower() and not tag.lower().startswith(q)
        ]
        logger.info(f"Found {len(contains)} additional tags that contain '{q}'")

        # Combine and limit the results
        suggestions = starts_with + contains
        suggestions = suggestions[:limit]

        logger.info(f"Returning {len(suggestions)} suggestions: {suggestions}")
        return {"suggestions": suggestions}
    except Exception as e:
        logger.error(f"Error getting tag suggestions: {str(e)}")
        return {"suggestions": []}


# # Add a direct route to handle pixelings assets
# @app.get("/pixelings/{filename:path}")
# @app.head("/pixelings/{filename:path}")
# async def serve_pixelings(filename: str):
#     """Serve pixelings assets directly from dist/assets/pixelings"""
#     asset_path = Path(f"dist/assets/pixelings/{filename}").resolve()

#     # Basic security check to prevent directory traversal
#     if not str(asset_path).startswith(str(Path("dist/assets/pixelings").resolve())):
#         raise HTTPException(status_code=403, detail="Access denied")

#     if not asset_path.exists():
#         logger.error(f"Pixeling asset not found: {filename}")
#         raise HTTPException(status_code=404, detail="Asset not found")

#     return FileResponse(asset_path)

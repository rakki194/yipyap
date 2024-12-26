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

from fastapi import FastAPI, HTTPException, Query, Request, File, UploadFile, Body
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from email.utils import parsedate_to_datetime, format_datetime
from typing import List
import shutil
import aiofiles

from .data_access import CachedFileSystemDataSource
from . import utils
from . import caption_generation

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
app.mount("/assets", StaticFiles(directory="assets"), name="assets")


# Initialize data source
ROOT_DIR = Path(os.getenv("ROOT_DIR", Path.cwd())).resolve()
THUMBNAIL_SIZE = (300, 300)
PREVIEW_SIZE = (1024, 1024)
data_source = CachedFileSystemDataSource(ROOT_DIR, THUMBNAIL_SIZE, PREVIEW_SIZE)

# Add this constant near the top of the file with other constants
CAPTION_TYPE_ORDER = {".e621": 0, ".tags": 1, ".wd": 2, ".caption": 3}

# Add configuration near other constants
JTP2_MODEL_PATH = Path(os.getenv(
    "JTP2_MODEL_PATH",
    "/home/kade/source/repos/JTP2/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors"
))
JTP2_TAGS_PATH = Path(os.getenv(
    "JTP2_TAGS_PATH", 
    "/home/kade/source/repos/JTP2/tags.json"
))

# Add near other constants
WDV3_MODEL_NAME = os.getenv("WDV3_MODEL_NAME", "vit")
WDV3_GEN_THRESHOLD = float(os.getenv("WDV3_GEN_THRESHOLD", "0.35"))
WDV3_CHAR_THRESHOLD = float(os.getenv("WDV3_CHAR_THRESHOLD", "0.75"))

# Initialize caption generators with graceful fallback
caption_generators = {}

if hasattr(caption_generation, "JTP2Generator"):
    try:
        logger.info(f"Initializing JTP2 generator with model path: {JTP2_MODEL_PATH}")
        jtp2_generator = caption_generation.JTP2Generator(
            model_path=JTP2_MODEL_PATH, 
            tags_path=JTP2_TAGS_PATH, 
            threshold=0.2
        )
        if jtp2_generator.is_available():
            caption_generators["jtp2"] = jtp2_generator
            logger.info("JTP2 caption generator initialized successfully")
        else:
            logger.warning("JTP2 caption generator is not available - initialization check failed")
    except Exception as e:
        logger.error(f"Failed to initialize JTP2 caption generator: {e}", exc_info=True)

if hasattr(caption_generation, "WDv3Generator"):
    try:
        wdv3_generator = caption_generation.WDv3Generator(
            model_name=WDV3_MODEL_NAME,
            gen_threshold=WDV3_GEN_THRESHOLD,
            char_threshold=WDV3_CHAR_THRESHOLD
        )
        if wdv3_generator.is_available():
            caption_generators["wdv3"] = wdv3_generator
        else:
            logger.warning("WDv3 caption generator is not available")
    except Exception as e:
        logger.warning(f"Failed to initialize WDv3 caption generator: {e}")


@app.get("/api/browse")
async def browse(
    request: Request,
    path: str = "",
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1),
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

    Supports:
        - HTTP HEAD requests
        - If-Modified-Since caching
        - Caption sorting
        - Async directory scanning
    """
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
                res.captions.sort(key=lambda x: CAPTION_TYPE_ORDER.get(f".{x[0]}", 999))
            yield f"{res.model_dump_json()}\n"

    return StreamingResponse(
        stream_response(), media_type="application/ndjson", headers=headers
    )


# Used for deleting everything in a directory.
@app.delete("/api/browse/{path:path}")
async def delete_image(
    path: str, 
    confirm: bool = Query(True),
    preserve_latents: bool = Query(False), 
    preserve_txt: bool = Query(False)
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
            preserve_txt=preserve_txt
        )
        return {
            "confirm": confirm,
            "deleted_captions": captions,
            "deleted_files": files,
            "preserved_files": preserved
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


@app.put("/caption/{path:path}")
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
            raise HTTPException(status_code=404, detail=f"Image not found: {image_path}")
            
        caption_type = caption_data.get("type")
        caption_text = caption_data.get("caption", "")
        
        if not caption_type:
            raise HTTPException(status_code=400, detail="Missing caption type")
            
        # Create the caption file
        caption_path = image_path.with_suffix(f".{caption_type}")
        
        # Write the caption text
        async with aiofiles.open(caption_path, "w", encoding='utf-8') as f:
            await f.write(str(caption_text))
            
        # Touch the parent directory to force cache invalidation
        image_path.touch()
        
        # Update the cache through data_source
        await data_source.save_caption(image_path, str(caption_text), caption_type)
        
        return {"success": True}
        
    except Exception as e:
        logger.error(f"Error saving caption: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/config")
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


@app.put("/config/thumbnail_size")
async def update_thumbnail_size(size: int):
    """Update thumbnail size configuration."""
    if size < 100 or size > 500:
        raise HTTPException(status_code=400, detail="Invalid thumbnail size")
        
    # Update the thumbnail size
    data_source.set_thumbnail_size((size, size))
    
    # Clear thumbnail cache to regenerate with new size
    data_source.clear_thumbnail_cache()
    
    return {"success": True}


# Used for deleting a single caption file.
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


if not is_dev:

    @app.middleware("http")
    async def serve_spa(request: Request, call_next):
        response = await call_next(request)
        if response.status_code != 404:
            print("Not 404")
            return response

        # Check if the request is for HTML content
        accept_header = request.headers.get("accept", "")
        if "text/html" not in accept_header:
            print("Not HTML")
            return response

        if request.url.path.startswith(
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
        ):
            print("API or static", request.url.path)
            return response

        logger.debug(f"Serving SPA for path: {request.url.path}")
        return FileResponse("dist/index.html")


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
        if generator not in caption_generators:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown caption generator: {generator}. Available generators: {list(caption_generators.keys())}"
            )
            
        gen = caption_generators[generator]
        if not gen.is_available():
            raise HTTPException(
                status_code=503,
                detail=f"Caption generator {generator} is not available. Reason: initialization failed"
            )
            
        # Handle root directory case
        if path.startswith("_/"):
            path = path[2:]  # Remove "_/" prefix
            
        # Construct full image path
        image_path = utils.resolve_path(path, ROOT_DIR)
        if not image_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Image not found: {image_path}"
            )
        
        # Check if caption already exists
        caption_path = image_path.with_suffix(f".{gen.caption_type}")
        if not force and caption_path.exists():
            raise HTTPException(
                status_code=400,
                detail=f"Caption already exists: {caption_path}"
            )
            
        # Generate caption
        try:
            caption = await gen.generate(image_path)
        except Exception as e:
            logger.error(f"Error generating caption with {generator}: {e}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=f"Error generating caption with {generator}: {str(e)}"
            )
        
        # Save caption
        await data_source.save_caption(image_path, caption, gen.caption_type)
        
        return {"success": True, "caption": caption}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating caption: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# Add new endpoint to update model path
@app.put("/api/jtp2-config")
async def update_jtp2_config(config: dict):
    """
    Update JTP2 model configuration.
    
    Args:
        config (dict): New configuration settings
            - model_path (str, optional): Path to model file
            - tags_path (str, optional): Path to tags file
            
    Returns:
        dict: Success status
        
    Raises:
        HTTPException: If reinitialization fails
        
    Notes:
        - Updates global JTP2 paths
        - Reinitializes caption generator with new settings
    """
    global JTP2_MODEL_PATH, JTP2_TAGS_PATH
    
    if "model_path" in config:
        JTP2_MODEL_PATH = Path(config["model_path"])
    if "tags_path" in config:
        JTP2_TAGS_PATH = Path(config["tags_path"])
        
    # Reinitialize caption generator with new paths
    if "jtp2" in caption_generators:
        try:
            caption_generators["jtp2"] = caption_generation.JTP2Generator(
                model_path=JTP2_MODEL_PATH,
                tags_path=JTP2_TAGS_PATH,
                threshold=0.2
            )
            logger.info("JTP2 caption generator reinitialized with new paths")
        except Exception as e:
            logger.error(f"Failed to reinitialize JTP2 generator: {e}")
            raise HTTPException(status_code=500, detail=str(e))
            
    return {"success": True}


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
            
        for file in files:
            # Get the relative path from the file name/path
            relative_path = file.filename
            if not relative_path:
                continue
                
            # Create full target path
            full_path = target_dir / relative_path
            
            # Ensure the parent directory exists
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Save the file
            with full_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
        return {"message": "Files uploaded successfully"}
        
    except Exception as e:
        logger.error(f"Error uploading files: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Add a root upload endpoint as well
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
                status_code=400, 
                detail=f"Folder already exists: {path}"
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
    preserve_latents: bool = Query(False),
    preserve_txt: bool = Query(False)
):
    """
    Move files and folders to a target directory.
    
    Args:
        path (str): Current directory path
        target (str): Target directory path
        items (List[str]): List of items to move
        preserve_latents (bool): Whether to preserve .npz files
        preserve_txt (bool): Whether to preserve .txt files
    """
    try:
        source_dir = utils.resolve_path(path, ROOT_DIR)
        target_dir = utils.resolve_path(target, ROOT_DIR)
        
        # Ensure target directory exists
        target_dir.mkdir(parents=True, exist_ok=True)
        
        moved_items = []
        failed_items = []
        
        for item in items:
            try:
                source_path = source_dir / item
                target_path = target_dir / item
                
                # Skip if source doesn't exist or target already exists
                if not source_path.exists() or target_path.exists():
                    failed_items.append(item)
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
                        if (not preserve_latents and f.suffix == '.npz') or \
                           (not preserve_txt and f.suffix == '.txt'):
                            continue
                        shutil.move(str(f), str(target_dir / f.name))
                    moved_items.append(item)
                
            except Exception as e:
                logger.error(f"Failed to move {item}: {e}")
                failed_items.append(item)
        
        # Touch directories to force cache update
        source_dir.touch()
        target_dir.touch()
        
        # Clear cache for affected directories
        if source_dir in data_source.directory_cache:
            del data_source.directory_cache[source_dir]
        if target_dir in data_source.directory_cache:
            del data_source.directory_cache[target_dir]
        
        return {
            "success": True,
            "moved": moved_items,
            "failed": failed_items
        }
        
    except Exception as e:
        logger.error(f"Error moving items: {e}")
        raise HTTPException(status_code=500, detail=str(e))

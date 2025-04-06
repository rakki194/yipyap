"""
Utility functions for caption generation.

This module provides common utility functions used by multiple caption generators,
including:
- Running CPU-bound tasks in a thread pool
- Image loading and preprocessing utilities
- Error handling helpers
"""

import asyncio
import functools
import logging
import importlib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Callable, Any, TypeVar, cast

logger = logging.getLogger("uvicorn.error")

# Create a global thread pool executor for CPU-bound operations
# Using max_workers=None will use the default based on CPU count
_executor = ThreadPoolExecutor(max_workers=None)

T = TypeVar('T')


async def run_in_executor(func: Callable[..., T], *args: Any, **kwargs: Any) -> T:
    """
    Run a CPU-bound function in a thread pool executor.
    
    This function allows running blocking CPU-bound code without blocking the
    event loop. It's particularly useful for ML model inference and image
    processing operations.
    
    Args:
        func: The function to run
        *args: Positional arguments to pass to the function
        **kwargs: Keyword arguments to pass to the function
        
    Returns:
        The result of the function call
        
    Raises:
        Exception: Any exception raised by the function
        
    Example:
        ```python
        result = await run_in_executor(process_image, image_path)
        ```
    """
    loop = asyncio.get_event_loop()
    
    # Handle both normal functions and instance methods
    if kwargs:
        # If we have kwargs, wrap the function call
        wrapped = functools.partial(func, *args, **kwargs)
        return await loop.run_in_executor(_executor, wrapped)
    else:
        # Without kwargs, we can call directly (more efficient)
        return await loop.run_in_executor(_executor, func, *args)


def is_module_available(module_name: str) -> bool:
    """
    Check if a Python module is available without importing it.
    
    Args:
        module_name: Name of the module to check
        
    Returns:
        bool: True if the module is available, False otherwise
        
    Example:
        ```python
        if is_module_available("torch"):
            # Use torch-specific code
        else:
            # Use fallback
        ```
    """
    return importlib.util.find_spec(module_name) is not None


def get_supported_image_formats() -> set:
    """
    Get a set of supported image file extensions.
    
    Returns:
        set: Set of supported file extensions (lowercase, with dot)
        
    Example:
        ```python
        if image_path.suffix.lower() in get_supported_image_formats():
            # Process the image
        else:
            # Skip or raise error
        ```
    """
    # Standard formats always supported by Pillow
    formats = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp'}
    
    # Check for optional format support
    try:
        import pillow_jxl
        formats.add('.jxl')
    except ImportError:
        pass
    
    try:
        import pillow_avif
        formats.add('.avif')
    except ImportError:
        pass
    
    return formats

"""
Utility functions for caption generation.

This module provides helper functions used by caption generators, particularly
for handling CPU-bound operations in an asynchronous context. It ensures that
heavy computations don't block the event loop by running them in a thread pool.

Key Features:
- Asynchronous execution of CPU-bound tasks
- Thread pool management
- Error propagation
- Type safety
"""

import asyncio
from functools import partial
from typing import Callable, Any

async def run_in_executor(func: Callable, *args, **kwargs) -> Any:
    """
    Run a blocking function in an executor.
    
    This utility function allows running CPU-bound operations without blocking
    the event loop. It's particularly useful for ML model inference operations
    that would otherwise block async processing.
    
    Args:
        func (Callable): The blocking function to run
        *args: Positional arguments for the function
        **kwargs: Keyword arguments for the function
        
    Returns:
        Any: The result of the function call
        
    Raises:
        Exception: Any exception raised by the function
        
    Example:
        >>> async def process_image(path):
        ...     return await run_in_executor(heavy_computation, path)
        
    Notes:
        - Uses the default executor (typically ThreadPoolExecutor)
        - Wraps the function call in partial to handle arguments
        - Preserves exception traceback
        - Suitable for CPU-bound operations
    """
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, 
        partial(func, *args, **kwargs)
    ) 
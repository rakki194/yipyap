import asyncio
from functools import partial
from typing import Callable, Any

async def run_in_executor(func: Callable, *args, **kwargs) -> Any:
    """Run a blocking function in an executor"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, 
        partial(func, *args, **kwargs)
    ) 
from pathlib import Path
import aiofiles


async def get_caption(caption_path: Path) -> str:
    """Read caption from file if it exists."""
    try:
        async with aiofiles.open(caption_path, mode="r") as f:
            return await f.read()
    except FileNotFoundError:
        return ""


async def save_caption(caption_path: Path, caption: str) -> None:
    """Save caption to file."""
    async with aiofiles.open(caption_path, mode="w") as f:
        await f.write(caption)

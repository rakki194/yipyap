import importlib.util
import logging
from .base import CaptionGenerator

logger = logging.getLogger("uvicorn.error")

# Try to import optional dependencies
_has_torch = importlib.util.find_spec("torch") is not None
_has_timm = importlib.util.find_spec("timm") is not None
_has_safetensors = importlib.util.find_spec("safetensors") is not None

if not all((_has_torch, _has_timm, _has_safetensors)):
    logger.warning(
        "JTP2 caption generation disabled: missing dependencies (torch, timm, safetensors)"
    )
else:
    from .jtp2 import JTP2Generator

__all__ = ["CaptionGenerator", "JTP2Generator"]

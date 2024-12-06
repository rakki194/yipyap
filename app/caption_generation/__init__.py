import importlib.util
import logging
from .base import CaptionGenerator

logger = logging.getLogger("uvicorn.error")

# Try to import optional dependencies
_has_torch = importlib.util.find_spec("torch") is not None
_has_timm = importlib.util.find_spec("timm") is not None
_has_safetensors = importlib.util.find_spec("safetensors") is not None
_has_huggingface = importlib.util.find_spec("huggingface_hub") is not None

if not all((_has_torch, _has_timm)):
    logger.warning(
        "Caption generation disabled: missing core dependencies (torch, timm)"
    )
else:
    if not _has_safetensors:
        logger.warning("JTP2 caption generation disabled: missing safetensors")
    else:
        from .jtp2 import JTP2Generator
        
    if not _has_huggingface:
        logger.warning("WDv3 caption generation disabled: missing huggingface_hub")
    else:
        from .wdv3 import WDv3Generator

__all__ = ["CaptionGenerator", "JTP2Generator", "WDv3Generator"]

"""
Caption generation system initialization and dependency management.

This module handles the dynamic loading of caption generators based on available
dependencies. It implements graceful fallback behavior when optional dependencies
are missing, ensuring the application can still function without all caption
generation features.

The module checks for required dependencies:
- torch and timm: Core ML dependencies
- safetensors: Required for JTP2
- huggingface_hub: Required for WDv3

Each caption generator is only initialized if its dependencies are available,
with appropriate warning messages logged for missing dependencies.

Available Generators:
- JTP2Generator: Japanese Tag Predictor v2
- WDv3Generator: WD-1.4 Tagger v3

The module uses lazy imports to avoid loading unnecessary dependencies and provides
clear error messages when optional features are unavailable.
"""

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

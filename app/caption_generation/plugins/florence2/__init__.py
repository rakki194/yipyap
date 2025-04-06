"""
Florence2 captioner plugin registration.

This module registers the Florence2 captioner with the plugin system, providing
information about:
- Plugin name
- Module path
- Default configuration

The Florence2 captioner uses the Florence 2 computer vision model to generate
natural language captions for images with a focus on detailed descriptions.
"""

import os
from pathlib import Path


def register_plugin():
    """
    Register the Florence2 plugin with the system.
    
    Returns:
        dict: Plugin registration information
    """
    # Default path to the toolkit implementation
    default_path = os.getenv(
        "FLORENCE2_PATH",
        "/home/kade/toolkit/caption/florence.py"
    )
    
    return {
        "name": "florence2",
        "module_path": "app.caption_generation.plugins.florence2.generator",
        "default_config": {
            "script_path": default_path,
            "use_gpu": not bool(os.getenv("FLORENCE2_FORCE_CPU", "false").lower() == "true"),
            "precision": os.getenv("FLORENCE2_PRECISION", "fp16"),
            "max_tokens": int(os.getenv("FLORENCE2_MAX_TOKENS", "77"))
        }
    } 
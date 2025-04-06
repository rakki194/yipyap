"""
JoyCaptioner plugin registration.

This module registers the JoyCaptioner with the plugin system, providing
information about:
- Plugin name
- Module path
- Default configuration

The JoyCaptioner generates high-quality, customizable captions for images using
a combination of CLIP and LLM models.
"""

import os
from pathlib import Path


def register_plugin():
    """
    Register the JoyCaptioner plugin with the system.
    
    Returns:
        dict: Plugin registration information
    """
    # Default path to the toolkit implementation
    default_path = os.getenv(
        "JOYCAPTION_PATH",
        "/home/kade/toolkit/caption/joy.py"
    )
    
    return {
        "name": "joycaption",
        "module_path": "app.caption_generation.plugins.joycaption.generator",
        "default_config": {
            "script_path": default_path,
            "model_path": os.getenv(
                "JOYCAPTION_MODEL_PATH", 
                "/home/kade/toolkit/caption/cgrkzexw-599808"
            ),
            "caption_type": "descriptive",
            "length": "medium",
            "force_cpu": False
        }
    } 
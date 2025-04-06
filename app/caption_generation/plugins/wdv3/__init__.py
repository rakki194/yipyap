"""
WDv3 captioner plugin registration.

This module registers the WDv3 captioner with the plugin system, providing
information about:
- Plugin name
- Module path
- Default configuration

The WDv3 captioner generates tags using the WD-1.4 Tagger v3 model,
with separate thresholds for general and character tags.
"""

import os


def register_plugin():
    """
    Register the WDv3 plugin with the system.

    Returns:
        dict: Plugin registration information
    """
    return {
        "name": "wdv3",
        "module_path": "app.caption_generation.plugins.wdv3.generator",
        "default_config": {
            "model_name": os.getenv("WDV3_MODEL_NAME", "vit"),
            "gen_threshold": float(os.getenv("WDV3_GEN_THRESHOLD", "0.35")),
            "char_threshold": float(os.getenv("WDV3_CHAR_THRESHOLD", "0.75")),
            "force_cpu": os.getenv("WDV3_FORCE_CPU", "false").lower() == "true",
        },
    }

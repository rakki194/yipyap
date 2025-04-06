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
    # Get the path to this plugin directory
    plugin_dir = Path(__file__).parent

    # Default to internal script
    default_path = plugin_dir / "florence_script.py"

    # Allow override through environment variable
    env_path = os.getenv("FLORENCE2_PATH")
    if env_path and Path(env_path).exists():
        default_path = env_path

    # Set up JTP2 model path if available
    jtp_model_path = os.getenv("FLORENCE2_JTP_MODEL")
    if not jtp_model_path:
        # Try to use the one from the local JTP2 repository
        local_jtp_model = Path(
            "/home/kade/source/repos/JTP2/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors"
        )
        if local_jtp_model.exists():
            jtp_model_path = str(local_jtp_model)

    return {
        "name": "florence2",
        "module_path": "app.caption_generation.plugins.florence2.generator",
        "default_config": {
            "script_path": str(default_path),
            "use_gpu": not bool(
                os.getenv("FLORENCE2_FORCE_CPU", "false").lower() == "true"
            ),
            "precision": os.getenv("FLORENCE2_PRECISION", "fp16"),
            "max_tokens": int(os.getenv("FLORENCE2_MAX_TOKENS", "77")),
            "jtp_model_path": jtp_model_path,
        },
    }

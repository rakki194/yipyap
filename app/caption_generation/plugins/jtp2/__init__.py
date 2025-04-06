"""
JTP2 captioner plugin registration.

This module registers the JTP2 captioner with the plugin system, providing
information about:
- Plugin name
- Module path
- Default configuration

The JTP2 captioner generates English tags for furry artwork using the
Joint Tagger Project PILOT2 model.
"""

from pathlib import Path


def register_plugin():
    """
    Register the JTP2 plugin with the system.
    
    Returns:
        dict: Plugin registration information
    """
    # Get the path to this plugin directory
    plugin_dir = Path(__file__).parent
    
    # Default paths relative to the plugin directory
    model_dir = plugin_dir / "models"
    
    return {
        "name": "jtp2",
        "module_path": "app.caption_generation.plugins.jtp2.generator",
        "default_config": {
            "model_path": str(model_dir / "JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors"),
            "tags_path": str(model_dir / "tags.json"),
            "threshold": 0.2,
            "force_cpu": False
        }
    } 
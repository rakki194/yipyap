"""
Plugin loading system for caption generators.

This module provides the infrastructure for dynamically discovering and loading
caption generator plugins. It implements a plugin registry pattern that allows
the application to discover available captioners at runtime without requiring
hard-coded dependencies.

Key features:
- Dynamic plugin discovery from the plugins directory
- Lazy loading of captioner instances to minimize startup time
- Configuration management for plugins
- Error isolation to prevent plugin failures from affecting the application

The plugin system supports:
- Runtime detection of available captioners
- Configuration updates without application restart
- Graceful handling of missing dependencies
"""

import importlib
import logging
from pathlib import Path
from typing import Dict, Optional, Any

from .base import CaptionGenerator

logger = logging.getLogger("uvicorn.error")


class CaptionerPlugin:
    """
    Plugin wrapper for a caption generator.
    
    This class manages the lifecycle of a captioner plugin, including:
    - Lazy initialization
    - Configuration management
    - Error handling
    
    Args:
        name (str): Unique identifier for this plugin
        module_path (str): Import path to the module containing the generator
        config (dict, optional): Configuration for the generator
    """
    
    def __init__(self, name: str, module_path: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.module_path = module_path
        self.config = config or {}
        self._instance = None
        self._available = None
    
    def get_instance(self) -> Optional[CaptionGenerator]:
        """
        Get or create the captioner instance.
        
        Returns:
            Optional[CaptionGenerator]: The captioner instance, or None if failed
            
        Notes:
            - Lazy-loads the instance on first call
            - Caches the instance for subsequent calls
            - Returns None if the plugin cannot be loaded
        """
        if self._instance is None:
            try:
                # Import the module
                module = importlib.import_module(self.module_path)
                
                # Get the generator factory function
                if not hasattr(module, 'get_generator'):
                    logger.error(f"Plugin {self.name} missing get_generator function")
                    return None
                
                # Create the generator instance
                generator_factory = getattr(module, 'get_generator')
                self._instance = generator_factory(self.config)
                
                # Verify it's a valid CaptionGenerator
                if not isinstance(self._instance, CaptionGenerator):
                    logger.error(
                        f"Plugin {self.name} returned invalid generator type: "
                        f"{type(self._instance).__name__}"
                    )
                    self._instance = None
                    return None
                
            except ImportError as e:
                logger.warning(
                    f"Failed to import captioner plugin {self.name}: {e}"
                )
                return None
            except Exception as e:
                logger.error(
                    f"Error initializing captioner plugin {self.name}: {e}",
                    exc_info=True
                )
                return None
                
        return self._instance
    
    def is_available(self) -> bool:
        """
        Check if the plugin is available and can be used.
        
        Returns:
            bool: True if the plugin can be used, False otherwise
            
        Notes:
            - Caches the result for performance
            - Checks both plugin loading and captioner availability
        """
        if self._available is None:
            instance = self.get_instance()
            self._available = instance is not None and instance.is_available()
        return self._available
    
    def reset(self) -> None:
        """
        Reset the plugin state, forcing re-initialization.
        
        This is useful when configuration has changed or when testing.
        """
        self._instance = None
        self._available = None


def discover_plugins() -> Dict[str, CaptionerPlugin]:
    """
    Discover all available captioner plugins.
    
    Returns:
        Dict[str, CaptionerPlugin]: Dictionary of plugin name to plugin instance
        
    Notes:
        - Searches the plugins directory for plugin packages
        - Each plugin must have an __init__.py with a register_plugin function
        - Handles errors gracefully to prevent plugin issues from breaking the app
    """
    plugins = {}
    plugin_dir = Path(__file__).parent / "plugins"
    
    if not plugin_dir.exists() or not plugin_dir.is_dir():
        logger.warning(f"Plugin directory not found: {plugin_dir}")
        return plugins
    
    # Scan for plugin directories
    for plugin_path in plugin_dir.glob("*/"):
        if not plugin_path.is_dir() or plugin_path.name.startswith("_"):
            continue
        
        # Check for __init__.py
        init_path = plugin_path / "__init__.py"
        if not init_path.exists():
            logger.debug(f"Skipping {plugin_path.name}: no __init__.py found")
            continue
        
        try:
            # Import the plugin module
            module_path = f"app.caption_generation.plugins.{plugin_path.name}"
            module = importlib.import_module(module_path)
            
            # Check for register_plugin function
            if not hasattr(module, "register_plugin"):
                logger.warning(
                    f"Plugin {plugin_path.name} missing register_plugin function"
                )
                continue
            
            # Get plugin info
            register_func = getattr(module, "register_plugin")
            plugin_info = register_func()
            
            # Validate plugin info
            if not isinstance(plugin_info, dict):
                logger.warning(
                    f"Plugin {plugin_path.name} returned invalid registration info"
                )
                continue
                
            if "name" not in plugin_info or "module_path" not in plugin_info:
                logger.warning(
                    f"Plugin {plugin_path.name} missing required registration fields"
                )
                continue
            
            # Create plugin instance
            name = plugin_info["name"]
            module_path = plugin_info["module_path"]
            default_config = plugin_info.get("default_config", {})
            
            plugins[name] = CaptionerPlugin(name, module_path, default_config)
            logger.info(f"Registered captioner plugin: {name}")
            
        except Exception as e:
            logger.warning(
                f"Error loading plugin from {plugin_path}: {e}",
                exc_info=True
            )
            continue
    
    return plugins 
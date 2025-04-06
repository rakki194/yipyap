"""
Caption generation system initialization and dependency management.

This module handles the dynamic loading of caption generators based on available
dependencies. It implements a plugin-based architecture for caption generation,
allowing easy extension with new captioners.

The module provides:
- A central manager for all caption generators
- Dynamic discovery of available captioners
- Configuration management for captioners
- A unified interface for generating captions

Available captioner plugins are discovered at runtime and can be accessed through
the CaptionerManager. The manager provides methods for:
- Getting information about available captioners
- Generating captions with a specific captioner
- Updating captioner configurations
"""

import importlib.util
import logging
from typing import Dict, Optional, List, Any

from .base import CaptionGenerator
from .plugin_loader import discover_plugins, CaptionerPlugin

logger = logging.getLogger("uvicorn.error")


class CaptionerManager:
    """
    Central manager for caption generator plugins.

    This class provides access to all available caption generators, handling:
    - Plugin discovery and registration
    - Configuration management
    - Access to generator instances
    - Information about available generators

    It serves as the main entry point for caption generation features.
    """

    def __init__(self):
        """
        Initialize the captioner manager.

        Discovers all available plugins on initialization but does not
        load any captioner instances until requested.
        """
        self._plugins = discover_plugins()
        logger.info(f"Discovered {len(self._plugins)} captioner plugins")

    def get_available_captioners(self) -> Dict[str, Dict[str, Any]]:
        """
        Get information about all available and ready-to-use captioners.

        Returns:
            Dict[str, Dict[str, Any]]: Dictionary of captioner information

        Notes:
            - Only includes captioners that are available (dependencies met)
            - Each entry contains metadata about the captioner (name, description, etc.)
            - Does not load captioner instances for unavailable captioners
        """
        result = {}

        for name, plugin in self._plugins.items():
            # Check if the plugin is available
            if not plugin.is_available():
                logger.debug(f"Captioner {name} is not available")
                continue

            # Get the captioner instance
            instance = plugin.get_instance()
            if not instance:
                continue

            # Add metadata to the result
            result[name] = {
                "name": name,
                "description": instance.description,
                "version": instance.version,
                "caption_type": instance.caption_type,
                "features": instance.features,
                "config_schema": instance.config_schema,
            }

        return result

    def get_captioner(self, name: str) -> Optional[CaptionGenerator]:
        """
        Get a specific captioner by name.

        Args:
            name (str): The name of the captioner to get

        Returns:
            Optional[CaptionGenerator]: The captioner instance, or None if not found

        Notes:
            - Returns None if the captioner is not available
            - Lazy-loads the captioner instance on first request
        """
        if name not in self._plugins:
            logger.warning(f"Captioner not found: {name}")
            return None

        plugin = self._plugins[name]
        if not plugin.is_available():
            logger.warning(f"Captioner {name} is not available")
            return None

        return plugin.get_instance()

    def get_captioner_names(self) -> List[str]:
        """
        Get the names of all available captioners.

        Returns:
            List[str]: List of captioner names

        Notes:
            - Only includes captioners that are available (dependencies met)
        """
        return list(self.get_available_captioners().keys())

    def update_captioner_config(self, name: str, config: Dict[str, Any]) -> bool:
        """
        Update a captioner's configuration.

        Args:
            name (str): The name of the captioner to update
            config (Dict[str, Any]): The new configuration values

        Returns:
            bool: True if the configuration was updated, False otherwise

        Notes:
            - Updates only the specified configuration values
            - Resets the captioner instance to apply the new configuration
            - Configuration is persisted for the life of the application
        """
        if name not in self._plugins:
            logger.warning(f"Cannot update config for unknown captioner: {name}")
            return False

        plugin = self._plugins[name]
        plugin.config.update(config)
        plugin.reset()

        logger.info(f"Updated configuration for captioner: {name}")
        return True

    def get_captioner_config(self, name: str) -> Optional[Dict[str, Any]]:
        """
        Get a captioner's current configuration.

        Args:
            name (str): The name of the captioner to get configuration for

        Returns:
            Optional[Dict[str, Any]]: The captioner's current configuration, or None if not found

        Notes:
            - Returns None if the captioner is not found
            - Returns the full configuration including default values
        """
        if name not in self._plugins:
            logger.warning(f"Cannot get config for unknown captioner: {name}")
            return None

        plugin = self._plugins[name]
        return plugin.config.copy()


# Create a global instance of the captioner manager
captioner_manager = CaptionerManager()

# Export the captioner manager and base classes
__all__ = ["CaptionGenerator", "captioner_manager", "CaptionerPlugin"]

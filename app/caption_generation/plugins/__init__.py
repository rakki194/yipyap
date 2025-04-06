"""
Caption generator plugins package.

This package contains all available caption generator plugins. Each plugin is
implemented as a separate module within this package.

Plugin Structure:
- Each plugin is a separate subdirectory
- Each plugin directory contains:
  - __init__.py: Plugin registration
  - generator.py: CaptionGenerator implementation
  - config.py (optional): Configuration constants

To add a new plugin:
1. Create a new subdirectory with the plugin name
2. Implement the required files following the plugin structure
3. Ensure the __init__.py exports a register_plugin function

The plugin system will automatically discover and load all valid plugins.
"""

# This file is intentionally empty beyond docstring
# Plugin registration is handled by each plugin's __init__.py 
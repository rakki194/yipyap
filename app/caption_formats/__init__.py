"""
Caption format handlers package.

This package provides modules for handling different caption file formats.
Each format module provides functions for reading, writing, and validating
its specific format.
"""

from .e621 import (
    read_e621_file,
    write_e621_file,
    create_empty_e621_file,
    merge_e621_tags,
    E621FormatError,
    validate_e621_structure,
)

__all__ = [
    'read_e621_file',
    'write_e621_file',
    'create_empty_e621_file',
    'merge_e621_tags',
    'E621FormatError',
    'validate_e621_structure',
] 
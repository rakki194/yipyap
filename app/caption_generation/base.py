"""
Base classes and interfaces for caption generation.

This module defines the abstract base class for caption generators, establishing
a common interface that all caption generators must implement. This allows for
a plugin-like architecture where different ML models can be easily integrated
into the system.

The CaptionGenerator ABC ensures that all generators provide:
- Async caption generation
- Availability checking
- Generator identification
- Caption type specification
"""

from abc import ABC, abstractmethod
from pathlib import Path

class CaptionGenerator(ABC):
    """
    Abstract base class for caption generators.
    
    All caption generators must inherit from this class and implement its abstract
    methods. This ensures a consistent interface across different generator types
    while allowing for model-specific optimizations.
    
    Attributes:
        None
        
    Methods:
        generate: Generate caption for an image
        is_available: Check if the model is available
        name: Get generator name
        caption_type: Get caption file type
    """
    
    @abstractmethod
    async def generate(self, image_path: Path, **kwargs) -> str:
        """
        Generate caption for an image.
        
        Args:
            image_path (Path): Path to the image file
            **kwargs: Additional model-specific parameters
            
        Returns:
            str: Generated caption text
            
        Raises:
            Exception: If caption generation fails
        """
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if the model and its dependencies are available.
        
        Returns:
            bool: True if the generator is ready to use, False otherwise
            
        Notes:
            - Should check for model files and required libraries
            - May verify GPU availability if required
        """
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """
        Get the name of the generator.
        
        Returns:
            str: Unique identifier for this generator type
        """
        pass

    @property
    @abstractmethod
    def caption_type(self) -> str:
        """
        Get the type of caption this generator produces.
        
        Returns:
            str: Caption file extension without dot (e.g., "caption", "tags")
        """
        pass 
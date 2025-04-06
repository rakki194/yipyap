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
- Configuration schema
- Version information
- Feature description

This design enables:
- Consistent interface across different models
- Easy addition of new generators
- Type safety through abstract methods
- Clear error handling
"""

from abc import ABC, abstractmethod
from pathlib import Path
from typing import List, Dict, Any


class CaptionGenerator(ABC):
    """
    Abstract base class for caption generators.

    All caption generators must inherit from this class and implement its abstract
    methods. This ensures a consistent interface across different generator types
    while allowing for model-specific optimizations.

    Required Methods:
        generate: Generate caption for an image
        is_available: Check if the model is available
        name: Get generator name
        caption_type: Get caption file type
        description: Human-readable description
        version: Version information
        config_schema: Configuration options schema

    Example Implementation:
        class MyGenerator(CaptionGenerator):
            async def generate(self, image_path: Path) -> str:
                # Implementation here
                return "Generated caption"

            def is_available(self) -> bool:
                return True  # Check dependencies

            @property
            def name(self) -> str:
                return "MyGenerator"

            @property
            def caption_type(self) -> str:
                return "caption"
                
            @property
            def description(self) -> str:
                return "My custom caption generator"
                
            @property
            def version(self) -> str:
                return "1.0.0"
                
            @property
            def config_schema(self) -> dict:
                return {
                    "type": "object",
                    "properties": {
                        "threshold": {"type": "number"}
                    }
                }
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

        Notes:
            - Should handle image loading errors
            - Should implement timeout handling
            - Should clean up resources
        """
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if the model and its dependencies are available.

        Returns:
            bool: True if the generator is ready to use, False otherwise

        Notes:
            - Should check for model files
            - Should verify required libraries
            - May check GPU availability
            - Should handle missing dependencies gracefully
        """
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """
        Get the name of the generator.

        Returns:
            str: Unique identifier for this generator type

        Notes:
            - Should be a valid Python identifier
            - Should be unique across all generators
            - Used for logging and error messages
        """
        pass

    @property
    @abstractmethod
    def caption_type(self) -> str:
        """
        Get the type of caption this generator produces.

        Returns:
            str: Caption file extension without dot (e.g., "caption", "tags")

        Notes:
            - Used for file extension
            - Should match expected format
            - No leading dot
        """
        pass
        
    @property
    @abstractmethod
    def description(self) -> str:
        """
        Human-readable description of the captioner.
        
        Returns:
            str: Description of what this captioner does and its strengths
            
        Notes:
            - Should be concise but informative
            - Can include information about the model's specialty
            - Used for UI display and documentation
        """
        pass
        
    @property
    @abstractmethod
    def version(self) -> str:
        """
        Version information for this captioner.
        
        Returns:
            str: Version string in semver format (e.g., "1.0.0")
            
        Notes:
            - Should follow semantic versioning when possible
            - Used for compatibility checking and updates
        """
        pass
        
    @property
    @abstractmethod
    def config_schema(self) -> Dict[str, Any]:
        """
        JSON Schema for configuration options.
        
        Returns:
            Dict[str, Any]: JSON Schema describing available configuration options
            
        Notes:
            - Should follow JSON Schema specification
            - Used for UI generation and validation
            - Should include descriptions for each option
        """
        pass
    
    @property
    def features(self) -> List[str]:
        """
        List of special features/capabilities this captioner supports.
        
        Returns:
            List[str]: List of feature identifiers
            
        Notes:
            - Optional property with default implementation
            - Can include capabilities like "batch_processing", "multilingual", etc.
            - Used for feature discovery and UI customization
        """
        return []

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, Any, Optional

class CaptionGenerator(ABC):
    """Base class for caption generators"""
    
    @abstractmethod
    async def generate(self, image_path: Path, **kwargs) -> str:
        """Generate caption for an image"""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if the model and its dependencies are available"""
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Get the name of the generator"""
        pass

    @property
    @abstractmethod
    def caption_type(self) -> str:
        """Get the type of caption this generator produces"""
        pass 
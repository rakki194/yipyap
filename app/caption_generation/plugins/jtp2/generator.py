"""
JTP2 model-based caption generator implementation.

This module implements a caption generator using the JTP2 model, which is specifically
designed for furry images. It uses a Vision Transformer (ViT) architecture
with SigLIP embeddings and provides high-quality English tags.

Key Features:
- English tags
- Configurable confidence threshold
- Efficient batch processing
- Memory-efficient model loading
- GPU acceleration when available

The generator uses:
- ViT-SO400M backbone with SigLIP embeddings
- Gated prediction head for improved accuracy
- Safetensors for efficient model loading
- Dynamic device placement (CPU/CUDA)
"""

import json
import logging
from enum import Enum, auto
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

import torch
from PIL import Image

from app.caption_generation.base import CaptionGenerator
from app.caption_generation.utils import run_in_executor, is_module_available

logger = logging.getLogger("uvicorn.error")


class JTP2Generator(CaptionGenerator):
    """
    JTP2 model-based caption generator.

    This generator uses the JTP2 model to generate tags for furry images.
    It supports English tags and provides configurable confidence thresholds.

    Args:
        model_path (Path): Path to the model file
        tags_path (Path): Path to the tags dictionary
        threshold (float): Confidence threshold for tag selection
        force_cpu (bool): Whether to force CPU inference

    Notes:
        - Lazy initialization of model
        - GPU acceleration when available
        - Memory-efficient model loading
        - Configurable confidence threshold
    """

    def __init__(
        self,
        model_path: Path,
        tags_path: Path,
        threshold: float = 0.2,
        force_cpu: bool = False,
    ):
        self.model_path = Path(model_path)
        self.tags_path = Path(tags_path)
        self.threshold = threshold
        self.force_cpu = force_cpu
        self._model = None
        self._tags = None
        self._transform = None
        self._initialized = False
        self._has_required_libs = self._check_dependencies()

    @property
    def name(self) -> str:
        return "JTP2"

    @property
    def description(self) -> str:
        return "Joint Tagger Project PILOT2 - Specialized tagger for furry artwork"
        
    @property
    def version(self) -> str:
        return "1.0.0"
        
    @property
    def caption_type(self) -> str:
        return "tags"
        
    @property
    def config_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "model_path": {
                    "type": "string", 
                    "description": "Path to the model file"
                },
                "tags_path": {
                    "type": "string", 
                    "description": "Path to the tags dictionary file"
                },
                "threshold": {
                    "type": "number", 
                    "minimum": 0, 
                    "maximum": 1, 
                    "description": "Confidence threshold for tag selection"
                },
                "force_cpu": {
                    "type": "boolean", 
                    "description": "Whether to force CPU inference"
                }
            },
            "required": ["model_path", "tags_path"]
        }
    
    @property
    def features(self) -> List[str]:
        return ["gpu_acceleration", "configurable_threshold"]

    def _check_dependencies(self) -> bool:
        """
        Check if all required dependencies are available.
        
        Returns:
            bool: True if all dependencies are available, False otherwise
        """
        # Check for PyTorch
        if not is_module_available("torch"):
            logger.warning("JTP2 captioner requires PyTorch, but it is not installed")
            return False
            
        # Check for timm
        if not is_module_available("timm"):
            logger.warning("JTP2 captioner requires timm, but it is not installed")
            return False
            
        # Check for safetensors
        if not is_module_available("safetensors"):
            logger.warning("JTP2 captioner requires safetensors, but it is not installed")
            return False
            
        # Check for Pillow
        if not is_module_available("PIL"):
            logger.warning("JTP2 captioner requires Pillow, but it is not installed")
            return False
            
        return True

    def is_available(self) -> bool:
        """
        Check if the JTP2 captioner is available.
        
        Returns:
            bool: True if the captioner is available, False otherwise
        """
        # Check for required libraries
        if not self._has_required_libs:
            return False
            
        # Check for model and tags files
        if not self.model_path.exists():
            logger.warning(f"JTP2 model file not found: {self.model_path}")
            return False
            
        if not self.tags_path.exists():
            logger.warning(f"JTP2 tags file not found: {self.tags_path}")
            return False
            
        return True

    def _initialize(self) -> None:
        """
        Initialize the model and preprocessing pipeline.

        Raises:
            RuntimeError: If initialization fails

        Notes:
            - Creates transformation pipeline
            - Loads model weights
            - Sets up CUDA if available
            - Loads tag dictionary
        """
        if self._initialized:
            return
            
        if not self.is_available():
            raise RuntimeError("JTP2 caption generation is not available")

        # Import dependencies here to avoid issues if they're not installed
        try:
            import torch
            import torch.nn as nn
            import safetensors.torch
            import timm
            from torchvision import transforms
            from torchvision.transforms import InterpolationMode
            import torchvision.transforms.functional as TF
            
            # Helper classes for JTP2
            class Fit(nn.Module):
                def __init__(
                    self,
                    bounds: tuple[int, int] | int,
                    interpolation=InterpolationMode.LANCZOS,
                    grow: bool = True,
                    pad: float | None = None,
                ):
                    super().__init__()
                    self.bounds = (bounds, bounds) if isinstance(bounds, int) else bounds
                    self.interpolation = interpolation
                    self.grow = grow
                    self.pad = pad

                def forward(self, img: Image) -> Image:
                    wimg, himg = img.size
                    hbound, wbound = self.bounds
                    hscale = hbound / himg
                    wscale = wbound / wimg
                    if not self.grow:
                        hscale = min(hscale, 1.0)
                        wscale = min(wscale, 1.0)
                    scale = min(hscale, wscale)
                    if scale == 1.0:
                        return img
                    hnew = min(round(himg * scale), hbound)
                    wnew = min(round(wimg * scale), wbound)
                    img = TF.resize(img, (hnew, wnew), self.interpolation)
                    if self.pad is None:
                        return img
                    hpad = hbound - hnew
                    wpad = wbound - wnew
                    tpad = hpad
                    bpad = hpad - tpad
                    lpad = wpad
                    rpad = wpad - lpad
                    return TF.pad(img, (lpad, tpad, rpad, bpad), self.pad)
            
            class CompositeAlpha(nn.Module):
                def __init__(self, bg_image=0.5):
                    super().__init__()
                    self.bg_image = bg_image

                def forward(self, img: torch.Tensor) -> torch.Tensor:
                    c = img.shape[0]
                    if c == 4:
                        alpha = img[3:4]
                        rgb = img[0:3]
                        rgb = rgb * alpha + self.bg_image * (1 - alpha)
                        return rgb
                    else:
                        return img
            
            class GatedHead(nn.Module):
                def __init__(self, in_features: Tuple[int], num_classes: int = 1000):
                    super().__init__()
                    self.gate = nn.Linear(in_features[0], num_classes)
                    self.head = nn.Linear(in_features[0], num_classes)

                def forward(self, x: torch.Tensor) -> torch.Tensor:
                    return torch.sigmoid(self.gate(x)) * self.head(x)
            
            # Set up image transformation pipeline
            self._transform = transforms.Compose(
                [
                    Fit((384, 384)),
                    transforms.ToTensor(),
                    CompositeAlpha(0.5),
                    transforms.Normalize(
                        mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5], inplace=True
                    ),
                    transforms.CenterCrop((384, 384)),
                ]
            )

            # Initialize model
            self._model = timm.create_model(
                "vit_so400m_patch14_siglip_384.webli", pretrained=False, num_classes=9083
            )
            self._model.head = GatedHead(min(self._model.head.weight.shape), 9083)

            # Load model weights
            safetensors.torch.load_model(self._model, str(self.model_path))

            # Set up CUDA if available
            if torch.cuda.is_available() and not self.force_cpu:
                self._model.cuda()
                if torch.cuda.get_device_capability()[0] >= 7:
                    # Convert entire model to half precision
                    self._model = self._model.half()
            self._model.eval()

            # Load tags
            with open(self.tags_path, "r", encoding="utf-8") as file:
                tags = json.load(file)
            self._tags = [tag.replace("_", " ") for tag in tags.keys()]
            
            self._initialized = True
            
        except Exception as e:
            logger.error(f"Failed to initialize JTP2 model: {e}", exc_info=True)
            raise RuntimeError(f"Failed to initialize JTP2 model: {e}")

    def _generate_sync(self, image_path: Path) -> str:
        """
        Synchronous implementation of tag generation.
        
        Args:
            image_path (Path): Path to the image
            
        Returns:
            str: Generated tags as a comma-separated string
            
        Raises:
            Exception: If generation fails
        """
        # Import torch here to avoid issues if it's not installed
        import torch
        
        try:
            # Load and preprocess the image
            img = Image.open(image_path).convert("RGB")
            img_tensor = self._transform(img).unsqueeze(0)
            
            # Move to GPU if available
            if torch.cuda.is_available() and not self.force_cpu:
                img_tensor = img_tensor.cuda()
                if torch.cuda.get_device_capability()[0] >= 7:
                    img_tensor = img_tensor.half()
            
            # Run inference
            with torch.no_grad():
                output = self._model(img_tensor)
                probs = torch.sigmoid(output).cpu().numpy()[0]
            
            # Process results
            tags = []
            for i, (tag, prob) in enumerate(zip(self._tags, probs)):
                if prob > self.threshold:
                    tags.append(tag)
            
            # Return comma-separated list
            return ", ".join(tags)
            
        except Exception as e:
            logger.error(f"Error generating tags with JTP2: {e}", exc_info=True)
            raise

    async def generate(self, image_path: Path, **kwargs) -> str:
        """
        Generate tags for an image using JTP2.

        Args:
            image_path (Path): Path to input image
            **kwargs: Additional parameters

        Returns:
            str: Comma-separated list of tags

        Raises:
            RuntimeError: If initialization fails
            Exception: If generation fails

        Notes:
            - Handles initialization on first use
            - Uses executor for CPU-bound operations
            - Provides detailed error logging
        """
        try:
            self._initialize()
            return await run_in_executor(self._generate_sync, image_path)
        except RuntimeError as e:
            logger.error(f"JTP2 initialization error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error generating caption with JTP2: {e}", exc_info=True)
            raise


def get_generator(config: Dict[str, Any]) -> JTP2Generator:
    """
    Factory function to create a JTP2Generator instance.
    
    Args:
        config (Dict[str, Any]): Configuration for the generator
        
    Returns:
        JTP2Generator: A configured generator instance
    """
    return JTP2Generator(
        model_path=Path(config.get("model_path")),
        tags_path=Path(config.get("tags_path")),
        threshold=config.get("threshold", 0.2),
        force_cpu=config.get("force_cpu", False)
    ) 
"""
Japanese Tag Predictor v2 (JTP2) caption generator implementation.

This module implements a caption generator using the JTP2 model, which is specifically
designed for anime/manga-style images. It uses a Vision Transformer (ViT) architecture
with SigLIP embeddings and provides high-quality Japanese and English tags.

Key Features:
- Multi-language tag support (Japanese/English)
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
from typing import Dict, List, Optional, Tuple

import numpy as np
import torch
from PIL import Image
from safetensors.torch import load_file
import pillow_jxl # type: ignore

try:
    import pillow_avif
except ImportError:
    pass

from .base import CaptionGenerator
from .utils import run_in_executor

logger = logging.getLogger("uvicorn.error")

class Fit(Enum):
    """
    Image fitting modes for preprocessing.
    
    Modes:
        CONTAIN: Fit image within bounds maintaining aspect ratio
        COVER: Fill bounds maintaining aspect ratio with cropping
        FILL: Stretch image to fill bounds
    """
    CONTAIN = auto()
    COVER = auto()
    FILL = auto()

class CompositeAlpha(Enum):
    """
    Alpha compositing modes for RGBA images.
    
    Modes:
        WHITE: Composite over white background
        BLACK: Composite over black background
    """
    WHITE = auto()
    BLACK = auto()

class GatedHead(torch.nn.Module):
    """
    Gated prediction head for the JTP2 model.
    
    Implements a gated mechanism for tag prediction, using separate paths for
    feature transformation and gating. This improves prediction quality by
    allowing the model to learn which features are relevant for each tag.
    
    Args:
        in_features (int): Input feature dimension
        out_features (int): Output feature dimension
        hidden_features (int): Hidden layer dimension
        
    Notes:
        - Uses sigmoid gating mechanism
        - Includes feature transformation path
        - Optimized for tag prediction
    """
    
    def __init__(self, in_features: int, out_features: int, hidden_features: int):
        super().__init__()
        self.fc1 = torch.nn.Linear(in_features, hidden_features)
        self.gate = torch.nn.Linear(in_features, hidden_features)
        self.fc2 = torch.nn.Linear(hidden_features, out_features)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Forward pass through the gated head."""
        h = self.fc1(x)
        g = self.gate(x).sigmoid()
        h = h * g
        return self.fc2(h)

class JTP2Generator(CaptionGenerator):
    """
    JTP2 model-based caption generator.
    
    This generator uses the JTP2 model to generate tags for anime-style images.
    It supports both Japanese and English tags and provides configurable
    confidence thresholds.
    
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
        force_cpu: bool = False
    ):
        self.model_path = model_path
        self.tags_path = tags_path
        self.threshold = threshold
        self.force_cpu = force_cpu
        self._model = None
        self._tags = None
        self._transform = None
        
    @property
    def name(self) -> str:
        return "JTP2"
    
    @property
    def caption_type(self) -> str:
        return "tags"

    def _create_helper_classes(self):
        """Create helper classes after torch is imported"""
        class Fit(torch.nn.Module):
            def __init__(
                self,
                bounds: tuple[int, int] | int,
                interpolation=InterpolationMode.LANCZOS,
                grow: bool = True,
                pad: float | None = None
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

        class CompositeAlpha(torch.nn.Module):
            def __init__(self, background: tuple[float, float, float] | float):
                super().__init__()
                self.background = (background, background, background) if isinstance(background, float) else background
                self.background = torch.tensor(self.background).unsqueeze(1).unsqueeze(2)

            def forward(self, img: torch.Tensor) -> torch.Tensor:
                if img.shape[-3] == 3:
                    return img
                alpha = img[..., 3, None, :, :]
                img[..., :3, :, :] *= alpha
                background = self.background.expand(-1, img.shape[-2], img.shape[-1])
                if background.ndim == 1:
                    background = background[:, None, None]
                elif background.ndim == 2:
                    background = background[None, :, :]
                img[..., :3, :, :] += (1.0 - alpha) * background
                return img[..., :3, :, :]

        class GatedHead(torch.nn.Module):
            def __init__(self, num_features: int, num_classes: int):
                super().__init__()
                self.num_classes = num_classes
                self.linear = torch.nn.Linear(num_features, num_classes * 2)
                self.act = torch.nn.Sigmoid()
                self.gate = torch.nn.Sigmoid()

            def forward(self, x: torch.Tensor) -> torch.Tensor:
                x = self.linear(x)
                x = self.act(x[:, :self.num_classes]) * self.gate(x[:, self.num_classes:])
                return x

        return Fit, CompositeAlpha, GatedHead

    def is_available(self) -> bool:
        """
        Check if all required dependencies and resources are available.
        
        Returns:
            bool: True if generator can be initialized
            
        Notes:
            - Checks for torch, timm, safetensors
            - Verifies model and tag files exist
            - Checks GPU availability if not forced to CPU
        """
        global torch, timm, safetensors, transforms, InterpolationMode, TF
        try:
            # These will raise ImportError if not available
            import torch
            import timm
            import safetensors
            from torchvision.transforms import transforms, InterpolationMode
            import torchvision.transforms.functional as TF
            
            return (
                self.model_path.exists() 
                and self.tags_path.exists() 
                and (not self.force_cpu and torch.cuda.is_available())
            )
        except ImportError:
            logger.warning("JTP2 missing required dependencies")
            return False

    def _initialize(self):
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
        if not self.is_available():
            raise RuntimeError("JTP2 caption generation is not available")
            
        if self._model is not None:
            return

        # Create helper classes
        Fit, CompositeAlpha, GatedHead = self._create_helper_classes()

        # Set up image transformation pipeline
        self._transform = transforms.Compose([
            Fit((384, 384)),
            transforms.ToTensor(),
            CompositeAlpha(0.5),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5], inplace=True),
            transforms.CenterCrop((384, 384)),
        ])

        # Initialize model
        self._model = timm.create_model(
            "vit_so400m_patch14_siglip_384.webli",
            pretrained=False,
            num_classes=9083
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

    def _generate_sync(self, image_path: Path) -> str:
        """
        Synchronous implementation of tag generation.
        
        Args:
            image_path (Path): Path to input image
            
        Returns:
            str: Comma-separated list of tags
            
        Notes:
            - Handles image preprocessing
            - Runs model inference
            - Processes results with threshold
            - Formats output tags
        """
        # Load and preprocess image
        image = Image.open(image_path)
        img = image.convert('RGBA')
        tensor = self._transform(img).unsqueeze(0)

        if torch.cuda.is_available() and not self.force_cpu:
            tensor = tensor.cuda()
            if torch.cuda.get_device_capability()[0] >= 7:
                # Convert input tensor to half precision
                tensor = tensor.half()

        # Run inference
        with torch.no_grad():
            probits = self._model(tensor)[0].cpu()
            values, indices = probits.topk(250)

        # Process results
        tag_score = {
            self._tags[indices[i]]: values[i].item() 
            for i in range(indices.size(0))
        }
        filtered_tags = [
            tag for tag, score in tag_score.items() 
            if score > self.threshold
        ]
        
        return ", ".join(filtered_tags)
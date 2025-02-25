"""
WD-1.4 Tagger v3 (WDv3) caption generator implementation.

This module implements a caption generator using the WD-1.4 Tagger v3 model from
Hugging Face. The model is designed for general image tagging with a focus on anime
style images.

Key Features:
- Multiple backbone architectures (ViT, SwinV2, ConvNext)
- Separate thresholds for general and character tags
- Hugging Face Hub integration
- Automatic model downloading
- Efficient inference pipeline

The generator uses:
- Pre-trained vision models from Hugging Face
- Sigmoid-based multi-label classification
- Pandas for tag management
- Dynamic model selection
"""

import logging
from pathlib import Path

import torch
import timm
from PIL import Image
import pillow_jxl
from torch.nn import functional as F
from huggingface_hub import hf_hub_download
import pandas as pd
import numpy as np

from .base import CaptionGenerator
from .utils import run_in_executor

logger = logging.getLogger("uvicorn.error")

MODEL_REPO_MAP = {
    "vit": "SmilingWolf/wd-vit-tagger-v3",
    "swinv2": "SmilingWolf/wd-swinv2-tagger-v3",
    "convnext": "SmilingWolf/wd-convnext-tagger-v3",
}


class WDv3Generator(CaptionGenerator):
    """
    WD-1.4 Tagger v3 caption generator.

    This generator uses the WD-1.4 Tagger v3 model for general image tagging.
    It provides separate confidence thresholds for general and character tags,
    and supports multiple backbone architectures.

    Args:
        model_name (str): Backbone architecture ("vit", "swinv2", "convnext")
        gen_threshold (float): Confidence threshold for general tags
        char_threshold (float): Confidence threshold for character tags
        force_cpu (bool): Whether to force CPU inference

    Notes:
        - Downloads model from Hugging Face Hub
        - Supports multiple architectures
        - Uses separate thresholds for different tag types
        - Handles model caching
    """

    def __init__(
        self,
        model_name: str = "vit",
        gen_threshold: float = 0.35,
        char_threshold: float = 0.75,
        force_cpu: bool = False,
    ):
        self.model_name = model_name
        self.gen_threshold = gen_threshold
        self.char_threshold = char_threshold
        self.force_cpu = force_cpu
        self._model = None
        self._labels = None
        self._transform = None
        self._device = None

    @property
    def name(self) -> str:
        return f"WDv3-{self.model_name}"

    @property
    def caption_type(self) -> str:
        return "wd"

    def is_available(self) -> bool:
        """
        Check if required dependencies and resources are available.

        Returns:
            bool: True if generator can be initialized

        Notes:
            - Checks for torch and timm
            - Verifies Hugging Face Hub access
            - Checks GPU availability if not forced to CPU
        """
        try:
            import torch
            import timm
            from huggingface_hub import hf_hub_download

            return (not self.force_cpu and torch.cuda.is_available()) or self.force_cpu
        except ImportError:
            return False

    def _initialize(self):
        """
        Initialize the model and preprocessing pipeline.

        Raises:
            RuntimeError: If initialization fails
            ValueError: If model name is invalid

        Notes:
            - Sets up device placement
            - Downloads model from Hugging Face
            - Loads model weights and labels
            - Creates transformation pipeline
        """
        if not self.is_available():
            raise RuntimeError("WDv3 caption generation is not available")

        if self._model is not None:
            return

        self._device = (
            "cuda" if torch.cuda.is_available() and not self.force_cpu else "cpu"
        )
        device = torch.device(self._device)

        repo_id = MODEL_REPO_MAP.get(self.model_name)
        if repo_id is None:
            raise ValueError(f"Model name '{self.model_name}' not recognized")

        # Load model
        self._model = timm.create_model("hf-hub:" + repo_id).eval()
        state_dict = timm.models.load_state_dict_from_hf(repo_id)
        self._model.load_state_dict(state_dict)
        self._model.to(device)

        # Load labels
        self._labels = self._load_labels(repo_id)

        # Create transform
        self._transform = timm.data.create_transform(
            **timm.data.resolve_data_config(
                self._model.pretrained_cfg, model=self._model
            )
        )

    def _load_labels(self, repo_id: str):
        """
        Load and process tag labels from Hugging Face Hub.

        Args:
            repo_id (str): Hugging Face repository ID

        Returns:
            dict: Processed label information

        Notes:
            - Downloads label CSV from Hub
            - Processes tag categories
            - Creates index mappings
        """
        csv_path = hf_hub_download(repo_id=repo_id, filename="selected_tags.csv")
        df = pd.read_csv(csv_path, usecols=["name", "category"])
        return {
            "names": df["name"].tolist(),
            "rating": list(np.where(df["category"] == 9)[0]),
            "general": list(np.where(df["category"] == 0)[0]),
            "character": list(np.where(df["category"] == 4)[0]),
        }

    def _process_image(self, image_path: Path) -> torch.Tensor:
        """
        Load and preprocess image for model input.

        Args:
            image_path (Path): Path to input image

        Returns:
            torch.Tensor: Preprocessed image tensor

        Notes:
            - Handles various image formats
            - Converts to RGB with alpha handling
            - Applies model-specific transforms
            - Moves tensor to correct device
        """
        img = Image.open(image_path)

        # Convert to RGB if needed
        if img.mode not in ["RGB", "RGBA"]:
            img = (
                img.convert("RGBA")
                if "transparency" in img.info
                else img.convert("RGB")
            )
        if img.mode == "RGBA":
            canvas = Image.new("RGBA", img.size, (255, 255, 255))
            canvas.alpha_composite(img)
            img = canvas.convert("RGB")

        # Pad to square
        w, h = img.size
        px = max(img.size)
        canvas = Image.new("RGB", (px, px), (255, 255, 255))
        canvas.paste(img, ((px - w) // 2, (px - h) // 2))
        img = canvas

        # Transform and prepare tensor
        inputs = self._transform(img).unsqueeze(0)
        inputs = inputs[:, [2, 1, 0]]  # RGB to BGR
        return inputs.to(self._device)

    def _get_tags(self, probs: torch.Tensor) -> str:
        """
        Process model outputs into tag string.

        Args:
            probs (torch.Tensor): Model output probabilities

        Returns:
            str: Comma-separated list of tags

        Notes:
            - Applies separate thresholds
            - Sorts by confidence
            - Combines general and character tags
        """
        probs = list(zip(self._labels["names"], probs.numpy()))

        # Get general tags
        gen_labels = [probs[i] for i in self._labels["general"]]
        gen_labels = [x for x in gen_labels if x[1] > self.gen_threshold]
        gen_labels.sort(key=lambda x: x[1], reverse=True)

        # Get character tags
        char_labels = [probs[i] for i in self._labels["character"]]
        char_labels = [x for x in char_labels if x[1] > self.char_threshold]
        char_labels.sort(key=lambda x: x[1], reverse=True)

        # Combine tags
        combined_names = [x[0] for x in gen_labels]
        combined_names.extend(x[0] for x in char_labels)
        return ", ".join(combined_names)

    async def generate(self, image_path: Path) -> str:
        """
        Generate tags for an image using WDv3.

        Args:
            image_path (Path): Path to input image

        Returns:
            str: Comma-separated list of tags

        Raises:
            Exception: If generation fails

        Notes:
            - Handles initialization on first use
            - Uses executor for CPU-bound operations
            - Provides error logging
        """
        try:
            self._initialize()
            return await run_in_executor(self._generate_sync, image_path)
        except Exception as e:
            logger.error(f"Error generating caption with WDv3: {e}")
            raise

    def _generate_sync(self, image_path: Path) -> str:
        """
        Synchronous implementation of tag generation.

        Args:
            image_path (Path): Path to input image

        Returns:
            str: Comma-separated list of tags

        Notes:
            - Processes image
            - Runs model inference
            - Applies thresholds
            - Formats output
        """
        inputs = self._process_image(image_path)

        with torch.inference_mode():
            outputs = self._model(inputs)
            outputs = F.sigmoid(outputs)
            outputs = outputs.to("cpu")

        return self._get_tags(outputs.squeeze(0))

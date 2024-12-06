import logging
from pathlib import Path
from typing import Optional

import torch
import timm
from PIL import Image
import pillow_jxl # type: ignore
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
    def __init__(
        self,
        model_name: str = "vit",
        gen_threshold: float = 0.35,
        char_threshold: float = 0.75,
        force_cpu: bool = False
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
        try:
            import torch
            import timm
            from huggingface_hub import hf_hub_download
            return (not self.force_cpu and torch.cuda.is_available()) or self.force_cpu
        except ImportError:
            return False

    def _initialize(self):
        if not self.is_available():
            raise RuntimeError("WDv3 caption generation is not available")
            
        if self._model is not None:
            return

        self._device = "cuda" if torch.cuda.is_available() and not self.force_cpu else "cpu"
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
            **timm.data.resolve_data_config(self._model.pretrained_cfg, model=self._model)
        )

    def _load_labels(self, repo_id: str):
        csv_path = hf_hub_download(repo_id=repo_id, filename="selected_tags.csv")
        df = pd.read_csv(csv_path, usecols=["name", "category"])
        return {
            "names": df["name"].tolist(),
            "rating": list(np.where(df["category"] == 9)[0]),
            "general": list(np.where(df["category"] == 0)[0]),
            "character": list(np.where(df["category"] == 4)[0]),
        }

    def _process_image(self, image_path: Path) -> torch.Tensor:
        img = Image.open(image_path)
        
        # Convert to RGB if needed
        if img.mode not in ["RGB", "RGBA"]:
            img = img.convert("RGBA") if "transparency" in img.info else img.convert("RGB")
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
        """Generate tags for an image using WDv3"""
        try:
            self._initialize()
            return await run_in_executor(self._generate_sync, image_path)
        except Exception as e:
            logger.error(f"Error generating caption with WDv3: {e}")
            raise

    def _generate_sync(self, image_path: Path) -> str:
        """Synchronous implementation of tag generation"""
        inputs = self._process_image(image_path)
        
        with torch.inference_mode():
            outputs = self._model(inputs)
            outputs = F.sigmoid(outputs)
            outputs = outputs.to("cpu")
        
        return self._get_tags(outputs.squeeze(0)) 
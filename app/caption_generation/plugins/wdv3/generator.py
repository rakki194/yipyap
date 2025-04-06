"""
WD-1.4 Tagger v3 caption generator implementation.

This module implements a caption generator using the WD-1.4 Tagger v3 model,
which is a general-purpose image tagger with separate thresholds for general
and character tags.

Key Features:
- General and character-specific tag detection
- Configurable confidence thresholds
- Multiple backbone architectures (ViT, SwinV2, ConvNeXT)
- Automatic download from Hugging Face Hub
- GPU acceleration when available

The generator uses:
- Hugging Face model cache for efficient downloads
- Separate thresholds for general and character tags
- Dynamic device placement (CPU/CUDA)
"""

import logging
import numpy as np
from pathlib import Path
from typing import List, Dict, Any

from app.caption_generation.base import CaptionGenerator
from app.caption_generation.utils import run_in_executor, is_module_available

logger = logging.getLogger("uvicorn.error")

# Map of model names to HuggingFace repositories
MODEL_REPO_MAP = {
    "vit": "SmilingWolf/wd-v1-4-vit-tagger-v2",
    "swinv2": "SmilingWolf/wd-v1-4-swinv2-tagger-v2",
    "convnext": "SmilingWolf/wd-v1-4-convnext-tagger-v2",
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
        self._initialized = False
        self._has_required_libs = self._check_dependencies()

    @property
    def name(self) -> str:
        return f"WDv3-{self.model_name}"

    @property
    def description(self) -> str:
        return "WD-1.4 Tagger v3 - General purpose image tagger with character recognition"
        
    @property
    def version(self) -> str:
        return "3.0.0"

    @property
    def caption_type(self) -> str:
        return "wd"

    @property
    def config_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "model_name": {
                    "type": "string",
                    "enum": list(MODEL_REPO_MAP.keys()),
                    "description": "Model architecture to use"
                },
                "gen_threshold": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1,
                    "description": "Confidence threshold for general tags"
                },
                "char_threshold": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1,
                    "description": "Confidence threshold for character tags"
                },
                "force_cpu": {
                    "type": "boolean",
                    "description": "Whether to force CPU inference"
                }
            }
        }
        
    @property
    def features(self) -> List[str]:
        return ["gpu_acceleration", "configurable_threshold", "character_recognition"]

    def _check_dependencies(self) -> bool:
        """
        Check if all required dependencies are available.
        
        Returns:
            bool: True if all dependencies are available, False otherwise
        """
        # Check for PyTorch
        if not is_module_available("torch"):
            logger.warning("WDv3 captioner requires PyTorch, but it is not installed")
            return False
            
        # Check for huggingface_hub
        if not is_module_available("huggingface_hub"):
            logger.warning("WDv3 captioner requires huggingface_hub, but it is not installed")
            return False
            
        # Check for Pillow
        if not is_module_available("PIL"):
            logger.warning("WDv3 captioner requires Pillow, but it is not installed")
            return False
            
        # Check for onnxruntime
        if not is_module_available("onnxruntime"):
            logger.warning("WDv3 captioner requires onnxruntime, but it is not installed")
            return False
            
        return True

    def is_available(self) -> bool:
        """
        Check if the WDv3 captioner is available.
        
        Returns:
            bool: True if the captioner is available, False otherwise
        """
        # Check for required libraries
        if not self._has_required_libs:
            return False
            
        # Model will be downloaded on demand, so we don't check for model files here
        return True

    def _initialize(self) -> None:
        """
        Initialize the model and preprocessing pipeline.

        Raises:
            RuntimeError: If initialization fails

        Notes:
            - Downloads model from Hugging Face Hub if needed
            - Sets up preprocessing pipeline
            - Creates ONNX runtime session
            - Loads and processes label data
        """
        if self._initialized:
            return
            
        if not self.is_available():
            raise RuntimeError("WDv3 caption generation is not available")

        # Import dependencies here to avoid issues if they're not installed
        try:
            import torch
            import numpy as np
            from huggingface_hub import hf_hub_download
            import onnxruntime as ort
            from PIL import Image
            
            # Get the model repository
            repo_id = MODEL_REPO_MAP.get(self.model_name)
            if not repo_id:
                raise RuntimeError(f"Unknown model name: {self.model_name}")
                
            # Download model and labels
            logger.info(f"Downloading WDv3 model: {repo_id}")
            model_path = hf_hub_download(repo_id, "model.onnx")
            labels_path = hf_hub_download(repo_id, "selected_tags.csv")
            
            # Create ONNX session
            # Use CUDA if available and not forced to CPU
            providers = ["CPUExecutionProvider"]
            if torch.cuda.is_available() and not self.force_cpu:
                providers.insert(0, "CUDAExecutionProvider")
                
            self._model = ort.InferenceSession(model_path, providers=providers)
            
            # Set up preprocessing function
            def preprocess_image(img_path):
                # Load and resize the image
                img = Image.open(img_path).convert("RGB")
                img = img.resize((448, 448), resample=Image.BICUBIC)
                
                # Convert to numpy array and normalize
                img_array = np.asarray(img, dtype=np.float32)
                img_array = img_array / 255.0
                
                # Channels first and add batch dimension
                img_array = np.transpose(img_array, (2, 0, 1))
                img_array = img_array[np.newaxis, ...]
                
                return img_array
                
            self._transform = preprocess_image
            
            # Load and process labels
            import csv
            labels = []
            general_ids = []
            character_ids = []
            
            with open(labels_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                next(reader)  # Skip header
                for i, row in enumerate(reader):
                    labels.append(row[1])  # Tag name is in the second column
                    if row[2] == '0':  # General tag
                        general_ids.append(i)
                    elif row[2] == '4':  # Character tag
                        character_ids.append(i)
            
            self._labels = {
                "names": labels,
                "general": general_ids,
                "character": character_ids
            }
            
            self._initialized = True
            logger.info(f"WDv3 model initialized successfully: {self.model_name}")
            
        except Exception as e:
            logger.error(f"Failed to initialize WDv3 model: {e}", exc_info=True)
            raise RuntimeError(f"Failed to initialize WDv3 model: {e}")

    def _get_tags(self, probs: np.ndarray) -> str:
        """
        Process model outputs into tag string.

        Args:
            probs (numpy.ndarray): Model output probabilities

        Returns:
            str: Comma-separated list of tags

        Notes:
            - Applies separate thresholds
            - Sorts by confidence
            - Combines general and character tags
        """
        
        probs = list(zip(self._labels["names"], probs))

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
        try:
            # Preprocess the image
            img_array = self._transform(image_path)
            
            # Get input name
            input_name = self._model.get_inputs()[0].name
            
            # Run inference
            outputs = self._model.run(None, {input_name: img_array})
            
            # Process results
            probs = outputs[0][0]
            
            # Generate tag string
            return self._get_tags(probs)
            
        except Exception as e:
            logger.error(f"Error generating tags with WDv3: {e}", exc_info=True)
            raise

    async def generate(self, image_path: Path, **kwargs) -> str:
        """
        Generate tags for an image using WDv3.

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
            - Provides error logging
        """
        try:
            self._initialize()
            return await run_in_executor(self._generate_sync, image_path)
        except RuntimeError as e:
            logger.error(f"WDv3 initialization error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error generating caption with WDv3: {e}", exc_info=True)
            raise


def get_generator(config: Dict[str, Any]) -> WDv3Generator:
    """
    Factory function to create a WDv3Generator instance.
    
    Args:
        config (Dict[str, Any]): Configuration for the generator
        
    Returns:
        WDv3Generator: A configured generator instance
    """
    return WDv3Generator(
        model_name=config.get("model_name", "vit"),
        gen_threshold=config.get("gen_threshold", 0.35),
        char_threshold=config.get("char_threshold", 0.75),
        force_cpu=config.get("force_cpu", False)
    ) 
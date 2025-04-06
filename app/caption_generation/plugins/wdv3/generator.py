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

# Import PIL at module level so it's available to all methods
try:
    from PIL import Image
except ImportError:
    # This will be caught by the _check_dependencies method
    pass

from app.caption_generation.base import CaptionGenerator
from app.caption_generation.utils import run_in_executor, is_module_available

logger = logging.getLogger("uvicorn.error")

# Import JXL plugin for JXL support
try:
    import pillow_jxl

    logger.info("JXL support enabled for WDv3")
except ImportError:
    logger.warning("JXL plugin not found, JXL images may not be supported")

# Map of model names to HuggingFace repositories
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
        self._initialized = False
        self._has_required_libs = self._check_dependencies()

    @property
    def name(self) -> str:
        return f"WDv3-{self.model_name}"

    @property
    def description(self) -> str:
        return (
            "WD-1.4 Tagger v3 - General purpose image tagger with character recognition"
        )

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
                    "description": "Model architecture to use",
                },
                "gen_threshold": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1,
                    "description": "Confidence threshold for general tags",
                },
                "char_threshold": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1,
                    "description": "Confidence threshold for character tags",
                },
                "force_cpu": {
                    "type": "boolean",
                    "description": "Whether to force CPU inference",
                },
            },
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
            logger.warning(
                "WDv3 captioner requires huggingface_hub, but it is not installed"
            )
            return False

        # Check for Pillow
        if not is_module_available("PIL"):
            logger.warning("WDv3 captioner requires Pillow, but it is not installed")
            return False

        # Check for onnxruntime
        if not is_module_available("onnxruntime"):
            logger.warning(
                "WDv3 captioner requires onnxruntime, but it is not installed"
            )
            return False

        # Check for JXL support
        try:
            import pillow_jxl

            logger.info("JXL support enabled for pillow in WDv3")
        except ImportError:
            logger.warning("pillow_jxl not found, JXL images may require conversion")

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
            # Add debug logging
            logger.info(f"Processing image: {image_path}")

            # Preprocess the image - now returns the NCHW format directly
            img_tensor = self._transform(image_path)

            # Debug logging for tensor shape and values
            logger.info(f"Input tensor shape: {img_tensor.shape}")
            logger.info(
                f"Input tensor min/max values: {img_tensor.min():.4f}/{img_tensor.max():.4f}"
            )

            # Get input name and shape info
            input_name = self._model.get_inputs()[0].name
            input_shape = self._model.get_inputs()[0].shape
            logger.info(
                f"Model expects input shape: {input_shape} with name: {input_name}"
            )

            # Run inference directly with the NCHW tensor
            logger.info("Running inference with NCHW format tensor")
            outputs = self._model.run(None, {input_name: img_tensor})

            # Debug output shape
            logger.info(f"Model output shape: {outputs[0].shape}")

            # Check if outputs contain reasonable probabilities
            probs = outputs[0][0]
            logger.info(
                f"Output probabilities range: {probs.min():.4f}/{probs.max():.4f}"
            )

            # Get top 5 tags by probability for debugging
            top_indices = np.argsort(probs)[-5:]
            logger.info(f"Top 5 tag indices: {top_indices}")

            # Show the actual tag names for these indices
            top_tags = [(self._labels["names"][i], probs[i]) for i in top_indices]
            logger.info(f"Top 5 tags: {top_tags}")

            # Save debug information about the output probabilities
            debug_dir = Path("/tmp/wdv3_debug")
            debug_dir.mkdir(exist_ok=True)
            img_name = Path(str(image_path)).name
            np.save(debug_dir / f"probs_{img_name}.npy", probs)

            # Save top 20 tags to a text file for inspection
            top20_indices = np.argsort(probs)[-20:]
            top20_tags = [
                (self._labels["names"][i], probs[i]) for i in reversed(top20_indices)
            ]
            with open(debug_dir / f"top_tags_{img_name}.txt", "w") as f:
                for tag, prob in top20_tags:
                    f.write(f"{tag}: {prob:.4f}\n")

            # Generate tag string
            tags = self._get_tags(probs)
            logger.info(f"Generated tags: '{tags[:100]}...' (truncated)")

            return tags

        except Exception as e:
            logger.error(f"Error generating tags with WDv3: {e}", exc_info=True)
            raise

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
            import onnxruntime as rt
            import pandas as pd

            # Get the model repository
            repo_id = MODEL_REPO_MAP.get(self.model_name)
            if not repo_id:
                raise RuntimeError(f"Unknown model name: {self.model_name}")

            # Download model and labels
            logger.info(f"Downloading WDv3 model: {repo_id}")
            model_path = hf_hub_download(repo_id, "model.onnx")
            labels_path = hf_hub_download(repo_id, "selected_tags.csv")

            # Create ONNX session
            # Use CUDA if available and not forced to CPU, but simplify to match reference implementation
            providers = ["CPUExecutionProvider"]
            if torch.cuda.is_available() and not self.force_cpu:
                providers.insert(0, "CUDAExecutionProvider")

            logger.info(f"Creating ONNX session with providers: {providers}")
            self._model = rt.InferenceSession(model_path, providers=providers)

            # Log model input and output details
            inputs = self._model.get_inputs()
            outputs = self._model.get_outputs()
            logger.info(
                f"Model input info: {[{'name': i.name, 'shape': i.shape} for i in inputs]}"
            )
            logger.info(
                f"Model output info: {[{'name': o.name, 'shape': o.shape} for o in outputs]}"
            )

            # Set up preprocessing function
            def preprocess_image(img_path):
                # Load image
                logger.info(f"Opening image: {img_path}")
                img = Image.open(img_path)
                logger.info(f"Original image size: {img.size}, mode: {img.mode}")

                # Convert RGBA to RGB with white background
                if img.mode == "RGBA":
                    canvas = Image.new("RGBA", img.size, (255, 255, 255))
                    canvas.alpha_composite(img)
                    img = canvas.convert("RGB")
                elif img.mode != "RGB":
                    img = img.convert("RGB")

                logger.info(f"After RGB conversion: {img.size}, mode: {img.mode}")

                # Pad image to square - EXACTLY as in the reference implementation
                image_shape = img.size
                max_dim = max(image_shape)
                pad_left = (max_dim - image_shape[0]) // 2
                pad_top = (max_dim - image_shape[1]) // 2

                padded_image = Image.new("RGB", (max_dim, max_dim), (255, 255, 255))
                padded_image.paste(img, (pad_left, pad_top))
                logger.info(
                    f"After padding to square: {padded_image.size}, mode: {padded_image.mode}"
                )

                # Resize to 448x448
                target_size = 448
                if max_dim != target_size:
                    padded_image = padded_image.resize(
                        (target_size, target_size),
                        Image.BICUBIC,
                    )
                logger.info(
                    f"After resize: {padded_image.size}, mode: {padded_image.mode}"
                )

                # Save intermediate image for debugging
                debug_dir = Path("/tmp/wdv3_debug")
                debug_dir.mkdir(exist_ok=True)
                img_name = Path(str(img_path)).name
                padded_image.save(debug_dir / f"input_{img_name}.png")

                # Convert to numpy array - EXACTLY as in the reference implementation
                image_array = np.asarray(padded_image, dtype=np.float32)

                # Convert RGB to BGR - EXACTLY as in the reference implementation
                # Important: This is the key difference - the reference simply does a channel flip
                image_array = image_array[:, :, ::-1]  # RGB to BGR

                # Add batch dimension - EXACTLY as in the reference implementation
                image_array = np.expand_dims(
                    image_array, axis=0
                )  # Shape: [1, 448, 448, 3]

                logger.info(
                    f"Final tensor shape: {image_array.shape}, format: NHWC (batch, height, width, channels)"
                )

                # Save debug information about the tensor
                np.save(debug_dir / f"tensor_{img_name}.npy", image_array)

                return image_array

            self._transform = preprocess_image

            # Load and process labels from CSV
            df = pd.read_csv(labels_path, usecols=["name", "category"])
            logger.info(f"Loaded {len(df)} labels from CSV")

            # Extract label names and category indices
            names = df["name"].tolist()
            rating_ids = list(np.where(df["category"] == 9)[0])
            general_ids = list(np.where(df["category"] == 0)[0])
            character_ids = list(np.where(df["category"] == 4)[0])

            logger.info(
                f"Label categories - Rating: {len(rating_ids)}, General: {len(general_ids)}, Character: {len(character_ids)}"
            )

            self._labels = {
                "names": names,
                "rating": rating_ids,
                "general": general_ids,
                "character": character_ids,
            }

            self._initialized = True
            logger.info(f"WDv3 model initialized successfully: {self.model_name}")

        except Exception as e:
            logger.error(f"Failed to initialize WDv3 model: {e}", exc_info=True)
            raise RuntimeError(f"Failed to initialize WDv3 model: {e}")

    def _get_tags(self, probs: np.ndarray) -> str:
        """
        Process model outputs into tag string, using the reference implementation approach.

        Args:
            probs (numpy.ndarray): Model output probabilities

        Returns:
            str: Comma-separated list of tags
        """
        # Convert indices+probs to labels
        probs = list(zip(self._labels["names"], probs))

        # First 4 labels are actually ratings (if present)
        rating_labels = {}
        if self._labels["rating"]:
            rating_labels = dict([probs[i] for i in self._labels["rating"]])

        # General labels, pick any where prediction confidence > threshold
        gen_labels = [probs[i] for i in self._labels["general"]]
        gen_labels = dict([x for x in gen_labels if x[1] > self.gen_threshold])
        gen_labels = dict(
            sorted(gen_labels.items(), key=lambda item: item[1], reverse=True)
        )

        # Character labels, pick any where prediction confidence > threshold
        char_labels = [probs[i] for i in self._labels["character"]]
        char_labels = dict([x for x in char_labels if x[1] > self.char_threshold])
        char_labels = dict(
            sorted(char_labels.items(), key=lambda item: item[1], reverse=True)
        )

        # Combine general and character labels
        combined_names = list(gen_labels.keys())
        combined_names.extend(list(char_labels.keys()))

        return ", ".join(combined_names)

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
        force_cpu=config.get("force_cpu", False),
    )

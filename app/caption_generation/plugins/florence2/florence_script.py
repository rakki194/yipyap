#!/usr/bin/env python
"""
Florence2 Image Captioning Script for integration with yipyap.

This script provides a command-line interface for generating captions using the
Florence2 model. It's designed to be executed by the yipyap Florence2 plugin.

The script loads the Florence2 model, processes the input image, and generates
a natural language caption.

Usage:
    python florence_script.py --image <image_path> [options]

Options:
    --image <path>        : Path to the image to caption (required)
    --precision <str>     : Model precision, 'fp16' or 'fp32' (default: fp16)
    --max_tokens <int>    : Maximum number of tokens in the caption (default: 77)
    --length <int>        : Target caption length in words (default: 100)
    --device <str>        : Device to use ('cuda' or 'cpu', default: cuda if available)
    --format <str>        : Output format ('text' or 'json', default: text)
    --jtp_model_path <str>: Path to JTP2 model for tag generation (optional)
    --verbose             : Enable verbose logging
"""

import os
import sys
import json
import time
import argparse
import logging
import contextlib
from pathlib import Path
from typing import Union, Optional, Dict, List

# Try to import pillow_jxl for JXL support
try:
    import pillow_jxl

    logging.info("JXL support enabled for PIL")
except ImportError:
    logging.warning("pillow_jxl not found, JXL images may require conversion")

from PIL import Image

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("florence2")


# Add compatibility shim for init_empty_weights (missing in some transformers versions)
@contextlib.contextmanager
def init_empty_weights():
    """
    A context manager that initializes model weights as empty.
    This is used as a fallback if the function is not available in the installed transformers library.
    """
    logger.info("Using custom init_empty_weights implementation")
    try:
        yield
    finally:
        pass


# Add compatibility shim for find_tied_parameters (missing in some transformers versions)
def find_tied_parameters(model) -> Dict[str, List[List[int]]]:
    """
    Find the tied parameters in the model to ensure they remain tied after parameter updates.

    Args:
        model: The model in which to find the tied parameters

    Returns:
        Dictionary of parameter names and tied parameter addresses
    """
    logger.info("Using custom find_tied_parameters implementation")
    # Return an empty dict as a simple implementation
    return {}


# Monkey patch missing functions into transformers.utils
try:
    import transformers.utils

    if not hasattr(transformers.utils, "init_empty_weights"):
        logger.info("Monkey patching init_empty_weights into transformers.utils")
        transformers.utils.init_empty_weights = init_empty_weights
    if not hasattr(transformers.utils, "find_tied_parameters"):
        logger.info("Monkey patching find_tied_parameters into transformers.utils")
        transformers.utils.find_tied_parameters = find_tied_parameters

    # Also add to modeling_utils
    import transformers.modeling_utils

    if not hasattr(transformers.modeling_utils, "init_empty_weights"):
        logger.info("Adding init_empty_weights to transformers.modeling_utils")
        transformers.modeling_utils.init_empty_weights = init_empty_weights
    if not hasattr(transformers.modeling_utils, "find_tied_parameters"):
        logger.info("Adding find_tied_parameters to transformers.modeling_utils")
        transformers.modeling_utils.find_tied_parameters = find_tied_parameters
except ImportError:
    logger.warning("Could not import transformers.utils for monkey patching")


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Florence2 Image Captioning")
    parser.add_argument("--image", type=str, required=True, help="Path to the image")
    parser.add_argument(
        "--precision",
        type=str,
        default="fp16",
        choices=["fp16", "fp32"],
        help="Model precision",
    )
    parser.add_argument(
        "--max_tokens", type=int, default=77, help="Maximum tokens in caption"
    )
    parser.add_argument(
        "--length", type=int, default=100, help="Target caption length in words"
    )
    parser.add_argument(
        "--device", type=str, default=None, help="Device to use (cuda or cpu)"
    )
    parser.add_argument(
        "--format",
        type=str,
        default="text",
        choices=["text", "json"],
        help="Output format",
    )
    parser.add_argument(
        "--jtp_model_path",
        type=str,
        default=None,
        help="Path to JTP2 model for tag generation",
    )
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    return parser.parse_args()


def setup_logging(verbose: bool = False):
    """Configure logging level based on verbosity."""
    level = logging.DEBUG if verbose else logging.INFO
    logger.setLevel(level)
    # Suppress transformers logging unless verbose
    if not verbose:
        logging.getLogger("transformers").setLevel(logging.ERROR)
        logging.getLogger("PIL").setLevel(logging.WARNING)


def load_model(device: Optional[str] = None, precision: str = "fp16"):
    """
    Load the Florence2 model.

    Args:
        device: Device to use (cuda or cpu)
        precision: Model precision (fp16 or fp32)

    Returns:
        tuple: (model, processor)
    """
    try:
        import torch
        from transformers import AutoProcessor

        # Try to import init_empty_weights from transformers,
        # or use our compatibility version if not available
        try:
            from transformers.utils import init_empty_weights

            logger.info("Using transformers.utils.init_empty_weights")
        except ImportError:
            logger.warning(
                "init_empty_weights not found in transformers.utils, using compatibility version"
            )
            # init_empty_weights is already defined above

        # Fix import path for florence2_implementation
        script_dir = os.path.dirname(os.path.abspath(__file__))
        if script_dir not in sys.path:
            sys.path.append(script_dir)
            logger.info(f"Added {script_dir} to sys.path")

        # Import locally to avoid dependency issues
        try:
            from florence2_implementation.modeling_florence2 import (
                Florence2ForConditionalGeneration,
            )
        except ImportError as e:
            logger.error(f"Error importing modeling_florence2: {e}")
            # Try absolute import
            try:
                from app.caption_generation.plugins.florence2.florence2_implementation.modeling_florence2 import (
                    Florence2ForConditionalGeneration,
                )

                logger.info("Successfully imported with absolute path")
            except ImportError:
                raise ImportError(
                    "Failed to import Florence2ForConditionalGeneration. Make sure the florence2_implementation directory exists and contains the required files."
                )

        # Determine device
        if device is None:
            device = "cuda" if torch.cuda.is_available() else "cpu"

        logger.info(f"Loading Florence2 model on {device} with {precision} precision")
        start_time = time.time()

        try:
            # Load model
            model = Florence2ForConditionalGeneration.from_pretrained(
                "lodestone-horizon/furrence2-large"
            ).eval()

            # Load processor from local directory
            script_dir = os.path.dirname(os.path.abspath(__file__))
            processor = AutoProcessor.from_pretrained(
                os.path.join(script_dir, "florence2_implementation"),
                trust_remote_code=True,
            )

            # Ensure precision is set correctly
            # If using cuda and fp16, convert to half precision first, then move to device
            # This ensures all model parameters have the same precision
            if device == "cuda" and precision == "fp16":
                logger.info("Converting model to half precision (fp16)")
                model = model.half()

            # Move model to device after setting precision
            logger.info(f"Moving model to {device}")
            model = model.to(device)

            logger.info(f"Model loaded in {time.time() - start_time:.2f} seconds")
            return model, processor
        except Exception as e:
            logger.error(f"Error during model loading: {e}", exc_info=True)
            raise

    except ImportError as e:
        logger.error(f"Missing dependencies: {e}")
        raise
    except Exception as e:
        logger.error(f"Error loading model: {e}", exc_info=True)
        raise


def load_jtp_model(model_path: str, device: str = "cuda", precision: str = "fp16"):
    """
    Load the JTP2 model for tag generation.

    Args:
        model_path: Path to the JTP2 model
        device: Device to use
        precision: Model precision (fp16 or fp32)

    Returns:
        tuple: (model, transform, tags_list)
    """
    try:
        import torch
        import torch.nn as nn
        import timm
        import safetensors.torch
        from torchvision import transforms
        from torchvision.transforms import InterpolationMode
        import json

        # Define helper classes for JTP2
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

            def forward(self, img: Image.Image) -> Image.Image:
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
                img = transforms.functional.resize(
                    img, (hnew, wnew), self.interpolation
                )
                if self.pad is None:
                    return img
                hpad = hbound - hnew
                wpad = wbound - wnew
                tpad = hpad
                bpad = hpad - tpad
                lpad = wpad
                rpad = wpad - lpad
                return transforms.functional.pad(
                    img, (lpad, tpad, rpad, bpad), self.pad
                )

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
            def __init__(self, num_features: int, num_classes: int):
                super().__init__()
                self.num_classes = num_classes
                self.linear = torch.nn.Linear(num_features, num_classes * 2)
                self.act = torch.nn.Sigmoid()
                self.gate = torch.nn.Sigmoid()

            def forward(self, x: torch.Tensor) -> torch.Tensor:
                x = self.linear(x)
                x = self.act(x[:, : self.num_classes]) * self.gate(
                    x[:, self.num_classes :]
                )
                return x

        # Load the model
        logger.info(f"Loading JTP2 model from {model_path}")
        start_time = time.time()

        # Load model and tags
        configs_dir = os.path.dirname(model_path)
        model_filename = os.path.basename(model_path)
        tags_path = os.path.join(configs_dir, "selected_tags.json")

        if not os.path.exists(tags_path):
            logger.error(f"Tags file not found: {tags_path}")
            return None, None, None

        with open(tags_path, "r") as f:
            tags_list = json.load(f)

        logger.info(f"Loaded {len(tags_list)} tags from {tags_path}")

        # Create and load model
        model = timm.create_model(
            "convnext_base.clip_laion2b_augreg_ft_in12k_in1k_384", pretrained=False
        )
        model.head = GatedHead(model.num_features, len(tags_list))

        try:
            if model_filename.endswith(".safetensors"):
                safetensors.torch.load_model(model, model_path)
            else:
                state_dict = torch.load(model_path, map_location="cpu")
                model.load_state_dict(state_dict)

            logger.info("Model weights loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model weights: {e}")
            return None, None, None

        # Set precision if needed
        if device == "cuda" and precision == "fp16":
            logger.info("Converting JTP2 model to half precision (fp16)")
            model = model.half()

        # Move model to device
        logger.info(f"Moving JTP2 model to {device}")
        model = model.to(device)
        model.eval()

        # Create transform
        transform = transforms.Compose(
            [
                Fit(384),
                transforms.ToTensor(),
                CompositeAlpha(),
                transforms.Normalize(
                    mean=(0.48145466, 0.4578275, 0.40821073),
                    std=(0.26862954, 0.26130258, 0.27577711),
                ),
            ]
        )

        logger.info(f"JTP2 model loaded in {time.time() - start_time:.2f} seconds")
        return model, transform, tags_list

    except ImportError as e:
        logger.error(f"Missing dependencies for JTP2: {e}")
        return None, None, None
    except Exception as e:
        logger.error(f"Error loading JTP2 model: {e}", exc_info=True)
        return None, None, None


def generate_tags(
    image: Image.Image,
    model,
    transform,
    tags_list,
    device: str = "cuda",
    threshold: float = 0.2,
    precision: str = "fp16",
):
    """
    Generate tags for an image using the JTP2 model.

    Args:
        image: PIL Image
        model: JTP2 model
        transform: Image transform
        tags_list: List of tag names
        device: Device to use
        threshold: Threshold for tag selection
        precision: Model precision

    Returns:
        str: Generated tags as a comma-separated string
    """
    import torch

    logger.info("Generating tags")
    start_time = time.time()

    try:
        # Transform image
        img_tensor = transform(image).unsqueeze(0)  # Add batch dimension

        # Move to device and apply precision
        img_tensor = img_tensor.to(device)
        if device == "cuda" and precision == "fp16":
            img_tensor = img_tensor.half()

        # Generate predictions
        with torch.no_grad():
            logits = model(img_tensor)
            probs = torch.sigmoid(logits)

        # Get tags above threshold
        selected_indices = torch.where(probs > threshold)[1].cpu().numpy()
        selected_tags = [tags_list[i] for i in selected_indices]

        # Sort tags by probability (highest first)
        tag_probs = {tags_list[i]: float(probs[0, i]) for i in selected_indices}
        sorted_tags = sorted(selected_tags, key=lambda t: tag_probs[t], reverse=True)

        logger.info(
            f"Generated {len(sorted_tags)} tags in {time.time() - start_time:.2f} seconds"
        )
        return ", ".join(sorted_tags)

    except Exception as e:
        logger.error(f"Error generating tags: {e}", exc_info=True)
        return ""


def construct_prompt(tags: str, expected_length: int = 100):
    """
    Construct a prompt for the Florence2 model.

    Args:
        tags: Space-separated tags
        expected_length: Expected length of the caption

    Returns:
        str: Prompt for the model
    """
    # Simple prompt construction
    prompt = "Write a detailed, descriptive caption for this image that is "
    prompt += f"approximately {expected_length} words long"
    prompt += ". The caption should be natural and engaging, incorporating these key elements: "
    prompt += ", ".join(tags.split())
    prompt += ". Focus on creating a cohesive narrative that flows naturally."

    return prompt


def generate_caption(
    image_path: Union[str, Path],
    max_tokens: int = 77,
    length: int = 100,
    device: Optional[str] = None,
    precision: str = "fp16",
    jtp_model_path: Optional[str] = None,
):
    """
    Generate a caption for an image.

    Args:
        image_path: Path to the image
        max_tokens: Maximum tokens in the caption
        length: Target caption length in words
        device: Device to use
        precision: Model precision
        jtp_model_path: Path to JTP2 model for tag generation

    Returns:
        str: Generated caption
    """
    import torch

    model, processor = load_model(device, precision)

    # Determine device
    if device is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    # Open and process image
    try:
        # Make sure the image path exists
        image_path = Path(image_path)
        if not image_path.exists():
            raise FileNotFoundError(f"Image file not found: {image_path}")

        logger.info(f"Loading image: {image_path}")

        # Try to load the image with PIL
        try:
            # For JXL files, we need pillow_jxl_plugin
            if image_path.suffix.lower() == ".jxl":
                try:
                    import pillow_jxl
                except ImportError:
                    logger.warning("pillow_jxl not found, trying to load JXL anyway")

            # Now try to open the image
            image = Image.open(image_path)

            # Convert to RGB mode
            image = image.convert("RGB")

            logger.info(
                f"Loaded image: {image_path} ({image.width}x{image.height}, mode={image.mode})"
            )
        except Exception as e:
            logger.error(f"Error opening image with PIL: {e}")
            raise
    except Exception as e:
        logger.error(f"Error opening image: {e}")
        return f"Error: Failed to open image: {e}"

    # Generate tags if JTP model path is provided
    if jtp_model_path and os.path.exists(jtp_model_path):
        logger.info("Generating tags with JTP2 model")
        jtp_model, transform, tags_list = load_jtp_model(
            jtp_model_path, device, precision
        )
        if jtp_model is not None:
            tags = generate_tags(
                image, jtp_model, transform, tags_list, device, precision=precision
            )
            logger.info(f"Generated tags: {tags[:100]}...")
            prompt = construct_prompt(tags, length)
        else:
            prompt = f"Write a detailed, descriptive caption for this image that is approximately {length} words long."
    else:
        logger.info("No JTP model provided, using simple prompt")
        prompt = f"Write a detailed, descriptive caption for this image that is approximately {length} words long."

    logger.info(f"Using prompt: {prompt[:100]}...")

    # Process inputs
    pixel_values = processor.image_processor(image, return_tensors="pt")["pixel_values"]
    inputs = processor.tokenizer(text=prompt, return_tensors="pt")

    # Move inputs to device and apply precision
    pixel_values = pixel_values.to(device)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Apply precision if using fp16
    if device == "cuda" and precision == "fp16":
        pixel_values = pixel_values.half()

    # Generate caption
    logger.info("Generating caption...")
    start_time = time.time()

    try:
        with torch.no_grad():
            outputs = model.generate(
                pixel_values=pixel_values,
                **inputs,
                max_new_tokens=max_tokens,
                do_sample=True,
                temperature=0.8,
                top_p=0.9,
            )

        # Decode the output tokens
        caption = processor.tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
        caption = caption.strip()

        logger.info(f"Caption generated in {time.time() - start_time:.2f} seconds")
        logger.info(f"Generated caption: {caption[:100]}...")

        return caption
    except Exception as e:
        logger.error(f"Error generating caption: {e}", exc_info=True)
        return f"Error generating caption: {e}"


def main():
    """Main function."""
    args = parse_args()
    setup_logging(args.verbose)

    try:
        # Generate caption
        caption = generate_caption(
            image_path=args.image,
            max_tokens=args.max_tokens,
            length=args.length,
            device=args.device,
            precision=args.precision,
            jtp_model_path=args.jtp_model_path,
        )

        # Format output
        if args.format == "json":
            result = json.dumps({"success": True, "caption": caption})
        else:
            result = caption

        print(result)
        return 0

    except Exception as e:
        logger.error(f"Error: {e}", exc_info=args.verbose)
        if args.format == "json":
            result = json.dumps({"success": False, "error": str(e)})
        else:
            result = f"Error: {e}"
        print(result)
        return 1


if __name__ == "__main__":
    sys.exit(main())

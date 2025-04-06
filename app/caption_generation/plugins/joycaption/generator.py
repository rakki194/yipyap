"""
JoyCaptioner plugin implementation.

This module provides a wrapper for the JoyCaptioner script, which generates
high-quality, customizable captions for images using a combination of CLIP
and LLM models.

Since JoyCaptioner is an external script, this wrapper executes it as a
subprocess and parses the results, providing a consistent interface with
the captioner plugin system.

Features:
- Multiple caption types (descriptive, training prompt, etc.)
- Length customization (short, medium, long)
- Support for external model paths
- CPU/GPU selection
"""

import logging
import subprocess
import json
import sys
from pathlib import Path
from typing import List, Dict, Any

from app.caption_generation.base import CaptionGenerator
from app.caption_generation.utils import run_in_executor, is_module_available

logger = logging.getLogger("uvicorn.error")


class JoyCaptionerGenerator(CaptionGenerator):
    """
    JoyCaptioner-based caption generator.

    This generator wraps the external JoyCaptioner script to provide
    high-quality, customizable captions for images.

    Args:
        script_path (str): Path to the JoyCaptioner script
        model_path (str): Path to the JoyCaptioner model directory
        caption_type (str): Type of caption to generate
        length (str): Length of caption (short, medium, long)
        force_cpu (bool): Whether to force CPU usage

    Notes:
        - Wrapper around external script
        - Supports multiple caption types
        - Configurable caption length
        - Optional GPU acceleration
    """

    def __init__(
        self,
        script_path: str,
        model_path: str,
        caption_type: str = "descriptive",
        length: str = "medium",
        force_cpu: bool = False,
    ):
        self.script_path = Path(script_path)
        self.model_path = Path(model_path)
        self.caption_type = caption_type
        self.length = length
        self.force_cpu = force_cpu
        self._has_required_deps = self._check_dependencies()

    @property
    def name(self) -> str:
        return "JoyCaptioner"

    @property
    def description(self) -> str:
        return "JoyCaptioner - High-quality customizable image captioner"

    @property
    def version(self) -> str:
        return "1.0.0"  # This is the wrapper version

    @property
    def caption_type(self) -> str:
        return "caption"

    @property
    def config_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "script_path": {
                    "type": "string",
                    "description": "Path to JoyCaptioner script",
                },
                "model_path": {
                    "type": "string",
                    "description": "Path to JoyCaptioner model directory",
                },
                "caption_type": {
                    "type": "string",
                    "enum": [
                        "descriptive",
                        "descriptive (informal)",
                        "training prompt",
                        "midjourney",
                        "booru tag list",
                        "booru-like tag list",
                        "art critic",
                        "product listing",
                        "social media post",
                    ],
                    "description": "Type of caption to generate",
                },
                "length": {
                    "type": "string",
                    "enum": ["short", "medium", "long"],
                    "description": "Length of generated caption",
                },
                "force_cpu": {
                    "type": "boolean",
                    "description": "Whether to force CPU usage",
                },
            },
            "required": ["script_path", "model_path"],
        }

    @property
    def features(self) -> List[str]:
        return ["gpu_acceleration", "customizable_caption_type", "customizable_length"]

    def _check_dependencies(self) -> bool:
        """
        Check if the JoyCaptioner script and its dependencies are available.

        Returns:
            bool: True if the requirements are met, False otherwise
        """
        # Check if the script exists
        if not self.script_path.exists():
            logger.warning(f"JoyCaptioner script not found at: {self.script_path}")
            return False

        # Check if Python is available (needed to run the script)
        if not is_module_available("sys"):
            logger.warning("Python environment not properly configured")
            return False

        # Check if the model directory exists
        if not self.model_path.exists() or not self.model_path.is_dir():
            logger.warning(
                f"JoyCaptioner model directory not found at: {self.model_path}"
            )
            return False

        return True

    def is_available(self) -> bool:
        """
        Check if JoyCaptioner is available.

        Returns:
            bool: True if the captioner is available, False otherwise
        """
        return self._has_required_deps

    def _generate_sync(self, image_path: Path) -> str:
        """
        Generate a caption for an image using JoyCaptioner.

        Args:
            image_path (Path): Path to the image file

        Returns:
            str: Generated caption

        Raises:
            RuntimeError: If caption generation fails
        """
        try:
            # Build command to run JoyCaptioner
            cmd = [
                sys.executable,
                str(self.script_path),
                "--image",
                str(image_path),
                "--checkpoint_path",
                str(self.model_path),
                "--caption_type",
                self.caption_type,
                "--length",
                self.length,
                "--format",
                "json",
            ]

            if self.force_cpu:
                cmd.extend(["--force_cpu"])

            logger.info(f"Running JoyCaptioner with command: {' '.join(cmd)}")

            # Run the command and capture output
            process = subprocess.run(cmd, capture_output=True, text=True, check=True)

            # Parse the output JSON
            try:
                output = json.loads(process.stdout)
                caption = output.get("caption", "")
                if not caption:
                    logger.warning("JoyCaptioner returned empty caption")
                    if process.stderr:
                        logger.warning(f"JoyCaptioner stderr: {process.stderr}")
                    raise RuntimeError("JoyCaptioner returned empty caption")
                return caption
            except json.JSONDecodeError:
                logger.error(f"Failed to parse JoyCaptioner output: {process.stdout}")
                if process.stderr:
                    logger.error(f"JoyCaptioner stderr: {process.stderr}")
                raise RuntimeError("Failed to parse JoyCaptioner output")

        except subprocess.CalledProcessError as e:
            logger.error(f"JoyCaptioner process failed with code {e.returncode}")
            if e.stdout:
                logger.error(f"JoyCaptioner stdout: {e.stdout}")
            if e.stderr:
                logger.error(f"JoyCaptioner stderr: {e.stderr}")
            raise RuntimeError(f"JoyCaptioner process failed: {e.stderr or e}")

        except Exception as e:
            logger.error(f"Error running JoyCaptioner: {e}")
            raise RuntimeError(f"Error running JoyCaptioner: {e}")

    async def generate(self, image_path: Path, **kwargs) -> str:
        """
        Generate caption for an image using JoyCaptioner.

        Args:
            image_path (Path): Path to the image file
            **kwargs: Additional parameters (not used)

        Returns:
            str: Generated caption

        Raises:
            RuntimeError: If caption generation fails
        """
        if not self.is_available():
            raise RuntimeError("JoyCaptioner is not available")

        try:
            return await run_in_executor(self._generate_sync, image_path)
        except Exception as e:
            logger.error(f"Error generating caption with JoyCaptioner: {e}")
            raise


def get_generator(config: Dict[str, Any]) -> JoyCaptionerGenerator:
    """
    Factory function to create a JoyCaptionerGenerator instance.

    Args:
        config (Dict[str, Any]): Configuration for the generator

    Returns:
        JoyCaptionerGenerator: A configured generator instance
    """
    return JoyCaptionerGenerator(
        script_path=config.get("script_path"),
        model_path=config.get("model_path"),
        caption_type=config.get("caption_type", "descriptive"),
        length=config.get("length", "medium"),
        force_cpu=config.get("force_cpu", False),
    )

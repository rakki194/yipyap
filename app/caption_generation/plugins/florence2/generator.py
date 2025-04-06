"""
Florence2 captioner plugin implementation.

This module provides a wrapper for the Florence2 captioner script, which
generates natural language captions for images using the Florence 2 model.

Since Florence2 is implemented as an external script, this wrapper executes it as
a subprocess and parses the results, providing a consistent interface with the
captioner plugin system.

Features:
- High-quality natural language captions
- GPU acceleration for faster inference
- Configurable precision (fp16/fp32)
- Adjustable token limit
"""

import logging
import subprocess
import json
import sys
import os
import shutil
from pathlib import Path
from typing import List, Dict, Any, Optional

from app.caption_generation.base import CaptionGenerator
from app.caption_generation.utils import run_in_executor, is_module_available

logger = logging.getLogger("uvicorn.error")


class Florence2Generator(CaptionGenerator):
    """
    Florence 2 model-based caption generator.

    This generator wraps the Florence2 script to provide
    high-quality natural language captions for images.

    Args:
        script_path (str): Path to the Florence2 script
        use_gpu (bool): Whether to use GPU for inference
        precision (str): Precision for model inference (fp16/fp32)
        max_tokens (int): Maximum number of tokens in generated caption
        jtp_model_path (str, optional): Path to JTP2 model for tag generation

    Notes:
        - Wrapper around external script
        - High-quality natural language captions
        - GPU acceleration for faster processing
        - Customizable inference parameters
    """

    def __init__(
        self,
        script_path: str,
        use_gpu: bool = True,
        precision: str = "fp16",
        max_tokens: int = 77,
        jtp_model_path: Optional[str] = None,
    ):
        self.script_path = Path(script_path)
        self.use_gpu = use_gpu
        self.precision = precision
        self.max_tokens = max_tokens
        self.jtp_model_path = Path(jtp_model_path) if jtp_model_path else None

        # Determine the plugin directory
        self.plugin_dir = Path(__file__).parent

        # Default to internal script if the script path doesn't exist or is a directory
        if not self.script_path.exists() or self.script_path.is_dir():
            self.script_path = self.plugin_dir / "florence_script.py"
            logger.info(f"Using internal Florence2 script at {self.script_path}")

        # Check for implementation directory
        self.impl_dir = self.plugin_dir / "florence2_implementation"
        if not self.impl_dir.exists():
            logger.warning(
                f"Florence2 implementation directory not found at {self.impl_dir}"
            )

        self._has_required_deps = self._check_dependencies()

    @property
    def name(self) -> str:
        return "Florence2"

    @property
    def description(self) -> str:
        return "Florence 2 - High-quality natural language image captioning model"

    @property
    def version(self) -> str:
        return "2.0.0"  # This is the wrapper version

    @property
    def caption_type(self) -> str:
        return "florence"

    @property
    def config_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "script_path": {
                    "type": "string",
                    "description": "Path to Florence2 script",
                },
                "use_gpu": {
                    "type": "boolean",
                    "description": "Whether to use GPU acceleration",
                },
                "precision": {
                    "type": "string",
                    "enum": ["fp16", "fp32"],
                    "description": "Precision for model inference",
                },
                "max_tokens": {
                    "type": "integer",
                    "minimum": 10,
                    "maximum": 200,
                    "description": "Maximum number of tokens in generated caption",
                },
                "jtp_model_path": {
                    "type": "string",
                    "description": "Path to JTP2 model for tag generation (optional)",
                },
            },
            "required": ["script_path"],
        }

    @property
    def features(self) -> List[str]:
        return ["gpu_acceleration", "natural_language", "configurable_precision"]

    def _check_dependencies(self) -> bool:
        """
        Check if the Florence2 script and its dependencies are available.

        Returns:
            bool: True if the requirements are met, False otherwise
        """
        # Check if the script exists
        script_exists = self.script_path.exists()
        if not script_exists:
            logger.warning(f"Florence2 script not found at: {self.script_path}")
            return False

        # Check if implementation directory exists
        impl_exists = self.impl_dir.exists()
        if not impl_exists:
            logger.warning(
                f"Florence2 implementation directory not found at: {self.impl_dir}"
            )

        # Check for Python
        if not is_module_available("sys"):
            logger.warning("Python environment not properly configured")
            return False

        # Check for PyTorch
        if not is_module_available("torch"):
            logger.warning("PyTorch not found, required for Florence2")
            return False

        # Check for Transformers
        if not is_module_available("transformers"):
            logger.warning("Transformers not found, required for Florence2")
            return False

        # Check for pillow_jxl_plugin (optional)
        if not is_module_available("pillow_jxl_plugin"):
            logger.warning(
                "pillow_jxl_plugin not found, JXL images may require conversion"
            )
            # We continue anyway, just with a warning

        # Check JTP model if specified
        if self.jtp_model_path and not self.jtp_model_path.exists():
            logger.warning(f"JTP2 model not found at: {self.jtp_model_path}")

        return script_exists and impl_exists

    def _ensure_implementation_files(self) -> bool:
        """
        Ensure all required implementation files are present.

        Returns:
            bool: True if all files are present or were successfully copied
        """
        try:
            # Create implementation directory if it doesn't exist
            self.impl_dir.mkdir(exist_ok=True, parents=True)

            # Check if we need to copy files from the reference implementation
            ref_impl_path = Path("/home/kade/toolkit/caption/florence2_implementation")
            if (
                ref_impl_path.exists()
                and not (self.impl_dir / "modeling_florence2.py").exists()
            ):
                logger.info(
                    f"Copying Florence2 implementation files from {ref_impl_path}"
                )

                # Files to copy
                files_to_copy = [
                    "modeling_florence2.py",
                    "processing_florence2.py",
                    "configuration_florence2.py",
                    "vocab.json",
                    "tokenizer.json",
                    "tokenizer_config.json",
                    "preprocessor_config.json",
                    "generation_config.json",
                ]

                # Copy files
                for file in files_to_copy:
                    src = ref_impl_path / file
                    dest = self.impl_dir / file
                    if src.exists() and not dest.exists():
                        logger.info(f"Copying {file} to {dest}")
                        shutil.copy2(src, dest)

            # Check if we have all required files
            required_files = [
                "modeling_florence2.py",
                "processing_florence2.py",
                "configuration_florence2.py",
                "vocab.json",
                "tokenizer.json",
                "tokenizer_config.json",
                "preprocessor_config.json",
            ]

            missing_files = [
                file for file in required_files if not (self.impl_dir / file).exists()
            ]
            if missing_files:
                logger.warning(
                    f"Missing Florence2 implementation files: {missing_files}"
                )
                return False

            return True

        except Exception as e:
            logger.error(f"Error ensuring implementation files: {e}")
            return False

    def is_available(self) -> bool:
        """
        Check if Florence2 is available.

        Returns:
            bool: True if the captioner is available, False otherwise
        """
        has_deps = self._has_required_deps
        has_files = self._ensure_implementation_files()

        if not has_deps:
            logger.warning("Florence2 dependencies not available")

        if not has_files:
            logger.warning("Florence2 implementation files not available")

        return has_deps and has_files

    def _generate_sync(self, image_path: Path) -> str:
        """
        Generate a caption for an image using Florence2.

        Args:
            image_path (Path): Path to the image file

        Returns:
            str: Generated caption

        Raises:
            RuntimeError: If caption generation fails
        """
        try:
            # Ensure implementation files are present
            if not self._ensure_implementation_files():
                raise RuntimeError("Florence2 implementation files not available")

            # Build command to run Florence2
            cmd = [
                sys.executable,
                str(self.script_path),
                "--image",
                str(image_path),
                "--precision",
                self.precision,
                "--max_tokens",
                str(self.max_tokens),
                "--format",
                "json",
            ]

            if not self.use_gpu:
                cmd.extend(["--device", "cpu"])

            # Add JTP model path if specified
            if self.jtp_model_path and self.jtp_model_path.exists():
                cmd.extend(["--jtp_model_path", str(self.jtp_model_path)])

            logger.info(f"Running Florence2 with command: {' '.join(cmd)}")

            # Run the command and capture output
            process = subprocess.run(cmd, capture_output=True, text=True, check=True)

            # Parse the output JSON
            try:
                output = json.loads(process.stdout)
                if not output.get("success", False):
                    error = output.get("error", "Unknown error")
                    logger.error(f"Florence2 failed: {error}")
                    raise RuntimeError(f"Florence2 failed: {error}")

                caption = output.get("caption", "")
                if not caption:
                    logger.warning("Florence2 returned empty caption")
                    if process.stderr:
                        logger.warning(f"Florence2 stderr: {process.stderr}")
                    raise RuntimeError("Florence2 returned empty caption")

                return caption

            except json.JSONDecodeError:
                logger.error(f"Failed to parse Florence2 output: {process.stdout}")
                if process.stderr:
                    logger.error(f"Florence2 stderr: {process.stderr}")
                raise RuntimeError("Failed to parse Florence2 output")

        except subprocess.CalledProcessError as e:
            logger.error(f"Florence2 process failed with code {e.returncode}")
            if e.stdout:
                logger.error(f"Florence2 stdout: {e.stdout}")
            if e.stderr:
                logger.error(f"Florence2 stderr: {e.stderr}")
            raise RuntimeError(f"Florence2 process failed: {e.stderr or e}")
        except Exception as e:
            logger.error(f"Error generating caption: {e}")
            raise RuntimeError(f"Failed to generate caption: {e}")

    async def generate(self, image_path: Path, **kwargs) -> str:
        """
        Generate a caption for an image.

        Args:
            image_path (Path): Path to the image file
            **kwargs: Additional parameters

        Returns:
            str: Generated caption

        Raises:
            RuntimeError: If caption generation fails
        """
        if not self.is_available():
            raise RuntimeError("Florence2 caption generation is not available")

        try:
            return await run_in_executor(self._generate_sync, image_path)
        except Exception as e:
            logger.error(f"Error generating caption with Florence2: {e}")
            raise RuntimeError(f"Error generating caption with Florence2: {e}")


def get_generator(config: Dict[str, Any]) -> Florence2Generator:
    """
    Factory function for creating a Florence2Generator instance.

    Args:
        config (Dict[str, Any]): Generator configuration

    Returns:
        Florence2Generator: Configured generator instance
    """
    return Florence2Generator(
        script_path=config.get("script_path"),
        use_gpu=config.get("use_gpu", True),
        precision=config.get("precision", "fp16"),
        max_tokens=config.get("max_tokens", 77),
        jtp_model_path=config.get("jtp_model_path"),
    )

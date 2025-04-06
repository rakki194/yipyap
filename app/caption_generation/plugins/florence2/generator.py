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
from pathlib import Path
from typing import List, Dict, Any, Optional

from app.caption_generation.base import CaptionGenerator
from app.caption_generation.utils import run_in_executor, is_module_available

logger = logging.getLogger("uvicorn.error")


class Florence2Generator(CaptionGenerator):
    """
    Florence 2 model-based caption generator.

    This generator wraps the external Florence2 script to provide
    high-quality natural language captions for images.

    Args:
        script_path (str): Path to the Florence2 script
        use_gpu (bool): Whether to use GPU for inference
        precision (str): Precision for model inference (fp16/fp32)
        max_tokens (int): Maximum number of tokens in generated caption
        
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
    ):
        self.script_path = Path(script_path)
        self.use_gpu = use_gpu
        self.precision = precision
        self.max_tokens = max_tokens
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
                    "description": "Path to Florence2 script"
                },
                "use_gpu": {
                    "type": "boolean",
                    "description": "Whether to use GPU acceleration"
                },
                "precision": {
                    "type": "string",
                    "enum": ["fp16", "fp32"],
                    "description": "Precision for model inference"
                },
                "max_tokens": {
                    "type": "integer",
                    "minimum": 10,
                    "maximum": 200,
                    "description": "Maximum number of tokens in generated caption"
                }
            },
            "required": ["script_path"]
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
        if not self.script_path.exists():
            logger.warning(f"Florence2 script not found at: {self.script_path}")
            return False
            
        # Check if Python is available (needed to run the script)
        if not is_module_available("sys"):
            logger.warning("Python environment not properly configured")
            return False
            
        return True

    def is_available(self) -> bool:
        """
        Check if Florence2 is available.
        
        Returns:
            bool: True if the captioner is available, False otherwise
        """
        return self._has_required_deps

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
            # Build command to run Florence2
            cmd = [
                sys.executable,
                str(self.script_path),
                "--image", str(image_path),
                "--precision", self.precision,
                "--max_tokens", str(self.max_tokens),
                "--format", "json"
            ]
            
            if not self.use_gpu:
                cmd.extend(["--device", "cpu"])
                
            logger.info(f"Running Florence2 with command: {' '.join(cmd)}")
            
            # Run the command and capture output
            process = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True
            )
            
            # Parse the output JSON
            try:
                output = json.loads(process.stdout)
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
            logger.error(f"Error running Florence2: {e}")
            raise RuntimeError(f"Error running Florence2: {e}")

    async def generate(self, image_path: Path, **kwargs) -> str:
        """
        Generate caption for an image using Florence2.

        Args:
            image_path (Path): Path to the image file
            **kwargs: Additional parameters (not used)

        Returns:
            str: Generated caption

        Raises:
            RuntimeError: If caption generation fails
        """
        if not self.is_available():
            raise RuntimeError("Florence2 is not available")
            
        try:
            return await run_in_executor(self._generate_sync, image_path)
        except Exception as e:
            logger.error(f"Error generating caption with Florence2: {e}")
            raise


def get_generator(config: Dict[str, Any]) -> Florence2Generator:
    """
    Factory function to create a Florence2Generator instance.
    
    Args:
        config (Dict[str, Any]): Configuration for the generator
        
    Returns:
        Florence2Generator: A configured generator instance
    """
    return Florence2Generator(
        script_path=config.get("script_path"),
        use_gpu=config.get("use_gpu", True),
        precision=config.get("precision", "fp16"),
        max_tokens=config.get("max_tokens", 77)
    ) 
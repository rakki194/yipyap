"""
Image loading and color space management utilities.

This module provides robust image loading capabilities with proper color space handling,
particularly for high-bit-depth and wide-gamut images. It ensures consistent color
reproduction by converting images to sRGB color space with appropriate rendering intents.

Key Features:
- Proper ICC profile handling
- Color space conversion with fallbacks
- Support for high-bit-depth formats
- Transparent handling of alpha channels
- Fallback to ImageMagick for problematic files

The module implements a sophisticated color management system that:
1. Detects and validates ICC profiles
2. Handles various color spaces (RGB, CMYK, LAB, etc.)
3. Provides configurable rendering intents
4. Manages alpha channels during conversion
"""

import logging
import subprocess
import tempfile
from io import BytesIO
from pathlib import Path
from typing import Mapping, TypeAlias

from PIL import Image, ImageCms, ImageFile, PngImagePlugin
from PIL.ImageCms import Intent

logger = logging.getLogger("uvicorn.error")

# Configure Pillow for large images
Image.MAX_IMAGE_PIXELS = None
PngImagePlugin.MAX_TEXT_CHUNK = 100 * (1024**2)
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Color management profiles and intent flags
_SRGB = ImageCms.createProfile(colorSpace="sRGB")

IntentFlags: TypeAlias = Mapping[Intent, int]

_INTENT_FLAGS_INITIAL: IntentFlags = {
    Intent.PERCEPTUAL: ImageCms.Flags.HIGHRESPRECALC,
    Intent.RELATIVE_COLORIMETRIC: ImageCms.Flags.HIGHRESPRECALC
    | ImageCms.Flags.BLACKPOINTCOMPENSATION,
    Intent.SATURATION: ImageCms.Flags.HIGHRESPRECALC,
    Intent.ABSOLUTE_COLORIMETRIC: ImageCms.Flags.HIGHRESPRECALC,
}

_INTENT_FLAGS_FALLBACK: IntentFlags = {
    Intent.PERCEPTUAL: ImageCms.Flags.HIGHRESPRECALC,
    Intent.RELATIVE_COLORIMETRIC: ImageCms.Flags.HIGHRESPRECALC
    | ImageCms.Flags.BLACKPOINTCOMPENSATION,
    Intent.ABSOLUTE_COLORIMETRIC: ImageCms.Flags.HIGHRESPRECALC,
}

_MODE_CONVERSIONS = {
    ("RGBA", "GRAY"): "LA",
    ("RGB", "GRAY"): "L",
    ("LA", "RGB "): "RGBA",
    ("L", "RGB "): "RGB",
    ("I;16", "RGB "): "RGB",
    ("RGB", "CMYK"): "CMYK",
}

_VALID_MODES = [
    ("RGBA", "RGB "),
    ("RGB", "RGB "),
    ("LA", "GRAY"),
    ("L", "GRAY"),
    ("I;16", "GRAY"),
    ("CMYK", "CMYK"),
]


def _coalesce_intent(intent: Intent | int) -> Intent:
    """
    Convert integer intent to ImageCms.Intent enum.

    Args:
        intent (Intent | int): Intent value to coalesce

    Returns:
        Intent: Corresponding Intent enum value

    Raises:
        ValueError: If intent value is invalid
    """
    if isinstance(intent, Intent):
        return intent

    match intent:
        case 0:
            return Intent.PERCEPTUAL
        case 1:
            return Intent.RELATIVE_COLORIMETRIC
        case 2:
            return Intent.SATURATION
        case 3:
            return Intent.ABSOLUTE_COLORIMETRIC
        case _:
            raise ValueError("invalid ImageCms intent")


def open_srgb(
    file_descriptor_or_path=None,
    *,
    file_descriptor=None,
    intent: Intent | int | None = Intent.RELATIVE_COLORIMETRIC,
    intent_flags: IntentFlags | None = None,
    intent_fallback: bool = True,
    formats: list[str] | tuple[str, ...] | None = None,
    force_load: bool = True,
):
    """
    Open an image and convert it to sRGB color space.

    Args:
        file_descriptor_or_path: File path or descriptor to open
        file_descriptor: Alternative file descriptor
        intent: Color rendering intent
        intent_flags: Custom intent flags
        intent_fallback: Whether to try fallback intents
        formats: List of allowed formats
        force_load: Whether to force immediate loading

    Returns:
        Image: PIL Image in sRGB color space

    Notes:
        - Handles various color spaces and profiles
        - Preserves alpha channels during conversion
        - Uses high-quality conversion settings
    """
    img = Image.open(file_descriptor or file_descriptor_or_path, formats=formats)
    if force_load:
        img.load()
    return ensure_srgb(
        img,
        intent=intent,
        intent_flags=intent_flags,
        intent_fallback=intent_fallback,
        fp=file_descriptor_or_path,
    )


def ensure_srgb(
    img: Image.Image,
    *,
    intent: Intent | int | None = Intent.RELATIVE_COLORIMETRIC,
    intent_flags: IntentFlags | None = None,
    intent_fallback: bool = True,
    fp: str = "<unknown>",
) -> Image.Image:
    """
    Convert an image to sRGB color space if needed.

    Args:
        img: PIL Image to convert
        intent: Color rendering intent
        intent_flags: Custom intent flags
        intent_fallback: Whether to try fallback intents
        fp: File path for logging

    Returns:
        Image: Converted image in sRGB color space

    Notes:
        - Handles alpha channel preservation
        - Supports various input color spaces
        - Uses high-quality conversion settings
    """
    if img.mode == "P" and img.info.get("transparency"):
        img = img.convert("PA")

    if img.mode == "RGBa":
        img = img.convert("RGBA")

    if img.mode == "La":
        img = img.convert("LA")

    match img.mode:
        case "RGBA" | "LA" | "PA":
            mode = "RGBA"
            alpha_channel = img.getchannel("A")
        case _:
            mode = "RGB"
            alpha_channel = None

    # ensure image is in sRGB color space
    if intent is not None:
        img = convert_profile(
            img,
            mode,
            intent=intent,
            intent_flags=intent_flags,
            intent_fallback=intent_fallback,
            fp=fp,
        )

    if img.mode != mode and alpha_channel is None:
        img = img.convert(mode)
    elif img.mode != mode and alpha_channel is not None:
        img = img.convert("RGB")
        img.putalpha(alpha_channel)

    return img


def convert_profile(
    img: Image.Image,
    mode: str,
    *,
    intent: Intent,
    intent_flags: IntentFlags | None,
    intent_fallback: bool = True,
    fp: str = "<unknown>",
):
    """
    Convert image using ICC profile.

    Args:
        img: PIL Image to convert
        mode: Target color mode
        intent: Color rendering intent
        intent_flags: Custom intent flags
        intent_fallback: Whether to try fallback intents
        fp: File path for logging

    Returns:
        Image: Converted image

    Notes:
        - Handles ICC profile validation
        - Supports various color spaces
        - Provides detailed logging
    """
    icc_raw = img.info.get("icc_profile")

    if icc_raw is not None:
        try:
            profile = ImageCms.ImageCmsProfile(BytesIO(icc_raw))
            intent = _coalesce_intent(intent)
        except OSError:
            logging.exception("Failed to parse ICC profile for %s", fp)
            return img

        if img.mode == "P":
            img = img.convert("RGB")
        elif img.mode == "PA":
            img = img.convert("RGBA")

        color_profile_sus = False
        color_mode_corrected = False

        if (img.mode, profile.profile.xcolor_space) not in _VALID_MODES:
            if (img.mode, profile.profile.xcolor_space) in _MODE_CONVERSIONS:
                img = img.convert(
                    _MODE_CONVERSIONS[(img.mode, profile.profile.xcolor_space)]
                )
                color_mode_corrected = True
            else:
                logger.warning(
                    f"{fp} has unhandled color space mismatch: '{profile.profile.xcolor_space}' != '{img.mode}'"
                )
                color_profile_sus = True

        if intent_fallback and not profile.profile.is_intent_supported(
            intent, ImageCms.Direction.INPUT
        ):
            intent = _coalesce_intent(ImageCms.getDefaultIntent(profile))
            if not not profile.profile.is_intent_supported(
                intent, ImageCms.Direction.INPUT
            ):
                logger.warning("This profile doesn't support any operations!")
            flags = (
                intent_flags if intent_flags is not None else _INTENT_FLAGS_FALLBACK
            ).get(intent)
        else:
            flags = (
                intent_flags if intent_flags is not None else _INTENT_FLAGS_INITIAL
            ).get(intent)

        if flags is None:
            raise KeyError(f"no flags for intent {intent}")

        try:
            if img.mode == mode:
                ImageCms.profileToProfile(
                    img,
                    profile,
                    _SRGB,
                    renderingIntent=intent,
                    inPlace=True,
                    flags=flags,
                )
            else:
                img = ImageCms.profileToProfile(
                    img,
                    profile,
                    _SRGB,
                    renderingIntent=intent,
                    outputMode=mode,
                    flags=flags,
                )
            if color_profile_sus and not color_mode_corrected:
                logger.warning(f"{fp} had a mismatched color profile but loaded fine.")
        except ImageCms.PyCMSError as e:
            logger.warning(
                f"Failed to load color profile for {fp}: {e}. Is it corrupt, or are we mishandling an edge case?"
            )

    return img


def run_magick_convert(input_path: Path):
    """
    Fix an image using ImageMagick.

    Args:
        input_path (Path): Path to input image

    Returns:
        Path: Path to converted temporary file

    Notes:
        - Creates temporary file for output
        - Uses ImageMagick's convert command
        - Caller must clean up temp file
    """
    output_path = Path(tempfile.mktemp(suffix=input_path.suffix))
    cmd = ["magick", str(input_path), str(output_path)]
    subprocess.check_call(cmd)
    return output_path


def open_image_magick_fallback(input_path: Path, force_load=True):
    """
    Open an image with Pillow, falling back to ImageMagick if needed.

    Args:
        input_path (Path): Path to input image
        force_load (bool): Whether to force immediate loading

    Returns:
        Image: Opened PIL Image

    Notes:
        - Attempts Pillow first
        - Falls back to ImageMagick on failure
        - Cleans up temporary files
        - Logs conversion attempts
    """
    try:
        img = open_srgb(input_path, force_load=force_load)
    except BaseException:
        logging.exception("Failed to open %s, retrying after converting", input_path)
        tmp_path = None
        try:
            tmp_path = run_magick_convert(input_path)
            img = open_srgb(tmp_path, force_load=force_load)
            logging.info("magick conversion successful")
        except BaseException as e:
            logging.exception(
                "Failed to open %s, even after magick conversion", input_path
            )
            raise e
        finally:
            if tmp_path and tmp_path.exists():
                tmp_path.unlink()

    return img

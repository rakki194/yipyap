# JTP2 Caption Generator Plugin

The JTP2 (Joint Tagger Project PILOT2) plugin is a caption generator that produces English tags for images using a fine-tuned vision model.

## Features

- Generate descriptive tags for images
- GPU acceleration for faster inference (when available)
- Configurable confidence threshold for tag selection
- Handles various image formats, including RGBA images

## Model Information

The JTP2 captioner uses the Joint Tagger Project PILOT2 model, which is based on the vision-so400m-14 architecture. The model is trained to recognize a variety of concepts in furry and anthro images.

## Configuration

The plugin accepts the following configuration parameters:

- `model_path`: Path to the model weights file (safetensors format)
- `tags_path`: Path to the tags dictionary file (JSON format)
- `threshold`: Confidence threshold for tag selection (default: 0.2)
- `force_cpu`: Whether to force CPU inference (default: false)

## Usage

You can use the JTP2 captioner through the API:

```bash
POST /api/generate-caption/{path:path}?generator=jtp2
```

## Implementation Details

The plugin is implemented in `generator.py` and uses:

- PyTorch for model inference
- timm for model architecture
- safetensors for model loading
- Pillow for image processing

## Model Loading Issue and Fix

The JTP2 model uses a `GatedHead` structure in our code, but the weights file contains a simple linear head. To resolve this mismatch, the plugin:

1. First loads the model weights with the original linear head structure
2. Then replaces it with a GatedHead that's initialized with the linear head's weights
3. This ensures compatibility with the weights while maintaining the expected structure

## Model Files

The model files should be placed in the `models/` directory. See the README in that directory for download instructions.

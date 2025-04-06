# JTP2 Model Files

This directory must contain the following files for the JTP2 captioner to work:

1. `JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors` - The model weights file
2. `tags.json` - The tags dictionary file

## Option 1: Use a Local JTP2 Repository

If you already have the JTP2 model files locally, you can update the plugin configuration to use those files directly.

1. Edit `app/caption_generation/plugins/jtp2/__init__.py` and update the `register_plugin` function to point to your local files:

```python
def register_plugin():
    """
    Register the JTP2 plugin with the system.
    
    Returns:
        dict: Plugin registration information
    """
    # Use the local JTP2 repository - replace with your path
    local_jtp2_dir = Path("/path/to/your/JTP2/repository")
    
    return {
        "name": "jtp2",
        "module_path": "app.caption_generation.plugins.jtp2.generator",
        "default_config": {
            "model_path": str(local_jtp2_dir / "JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors"),
            "tags_path": str(local_jtp2_dir / "tags.json"),
            "threshold": 0.2,
            "force_cpu": False
        }
    }
```

## Option 2: Download Model Files

If you don't have the model files locally, you can download them from Hugging Face:

The JTP2 (Joint Tagger Project PILOT2) model files can be downloaded from the following sources:

- [PILOT2 Model on Hugging Face](https://huggingface.co/RedRocket/JointTaggerProject/tree/main/JTP_PILOT2)

**Direct Download Links:**

- Model: <https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors>
- Tags: <https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/tags.json>

You can download these files using:

```bash
# Create the directory if it doesn't exist
mkdir -p app/caption_generation/plugins/jtp2/models

# Download the model files
wget -O app/caption_generation/plugins/jtp2/models/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors
wget -O app/caption_generation/plugins/jtp2/models/tags.json https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/tags.json
```

After configuring or downloading, restart the server to make the JTP2 captioner available.

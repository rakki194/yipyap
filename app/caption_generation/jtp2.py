import json
import logging
from pathlib import Path
from PIL import Image
import pillow_jxl # type: ignore

from .base import CaptionGenerator
from .utils import run_in_executor

logger = logging.getLogger("uvicorn.error")

# Initialize optional dependencies as None
torch = None
timm = None
safetensors = None
transforms = None
InterpolationMode = None
TF = None

class JTP2Generator(CaptionGenerator):
    def __init__(
        self,
        model_path: Path,
        tags_path: Path,
        threshold: float = 0.2,
        force_cpu: bool = False
    ):
        self.model_path = model_path
        self.tags_path = tags_path
        self.threshold = threshold
        self.force_cpu = force_cpu
        self._model = None
        self._tags = None
        self._transform = None
        
    @property
    def name(self) -> str:
        return "JTP2"
    
    @property
    def caption_type(self) -> str:
        return "tags"

    def _create_helper_classes(self):
        """Create helper classes after torch is imported"""
        class Fit(torch.nn.Module):
            def __init__(
                self,
                bounds: tuple[int, int] | int,
                interpolation=InterpolationMode.LANCZOS,
                grow: bool = True,
                pad: float | None = None
            ):
                super().__init__()
                self.bounds = (bounds, bounds) if isinstance(bounds, int) else bounds
                self.interpolation = interpolation
                self.grow = grow
                self.pad = pad

            def forward(self, img: Image) -> Image:
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
                img = TF.resize(img, (hnew, wnew), self.interpolation)
                if self.pad is None:
                    return img
                hpad = hbound - hnew
                wpad = wbound - wnew
                tpad = hpad 
                bpad = hpad - tpad
                lpad = wpad 
                rpad = wpad - lpad
                return TF.pad(img, (lpad, tpad, rpad, bpad), self.pad)

        class CompositeAlpha(torch.nn.Module):
            def __init__(self, background: tuple[float, float, float] | float):
                super().__init__()
                self.background = (background, background, background) if isinstance(background, float) else background
                self.background = torch.tensor(self.background).unsqueeze(1).unsqueeze(2)

            def forward(self, img: torch.Tensor) -> torch.Tensor:
                if img.shape[-3] == 3:
                    return img
                alpha = img[..., 3, None, :, :]
                img[..., :3, :, :] *= alpha
                background = self.background.expand(-1, img.shape[-2], img.shape[-1])
                if background.ndim == 1:
                    background = background[:, None, None]
                elif background.ndim == 2:
                    background = background[None, :, :]
                img[..., :3, :, :] += (1.0 - alpha) * background
                return img[..., :3, :, :]

        class GatedHead(torch.nn.Module):
            def __init__(self, num_features: int, num_classes: int):
                super().__init__()
                self.num_classes = num_classes
                self.linear = torch.nn.Linear(num_features, num_classes * 2)
                self.act = torch.nn.Sigmoid()
                self.gate = torch.nn.Sigmoid()

            def forward(self, x: torch.Tensor) -> torch.Tensor:
                x = self.linear(x)
                x = self.act(x[:, :self.num_classes]) * self.gate(x[:, self.num_classes:])
                return x

        return Fit, CompositeAlpha, GatedHead

    def is_available(self) -> bool:
        """Check if all required dependencies and resources are available"""
        global torch, timm, safetensors, transforms, InterpolationMode, TF
        try:
            # These will raise ImportError if not available
            import torch
            import timm
            import safetensors
            from torchvision.transforms import transforms, InterpolationMode
            import torchvision.transforms.functional as TF
            
            return (
                self.model_path.exists() 
                and self.tags_path.exists() 
                and (not self.force_cpu and torch.cuda.is_available())
            )
        except ImportError:
            logger.warning("JTP2 missing required dependencies")
            return False

    def _initialize(self):
        if not self.is_available():
            raise RuntimeError("JTP2 caption generation is not available")
            
        if self._model is not None:
            return

        # Create helper classes
        Fit, CompositeAlpha, GatedHead = self._create_helper_classes()

        # Set up image transformation pipeline
        self._transform = transforms.Compose([
            Fit((384, 384)),
            transforms.ToTensor(),
            CompositeAlpha(0.5),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5], inplace=True),
            transforms.CenterCrop((384, 384)),
        ])

        # Initialize model
        self._model = timm.create_model(
            "vit_so400m_patch14_siglip_384.webli",
            pretrained=False,
            num_classes=9083
        )
        self._model.head = GatedHead(min(self._model.head.weight.shape), 9083)
        
        # Load model weights
        safetensors.torch.load_model(self._model, str(self.model_path))

        # Set up CUDA if available
        if torch.cuda.is_available() and not self.force_cpu:
            self._model.cuda()
            if torch.cuda.get_device_capability()[0] >= 7:
                self._model.to(dtype=torch.float16, memory_format=torch.channels_last)
        self._model.eval()

        # Load tags
        with open(self.tags_path, "r", encoding="utf-8") as file:
            tags = json.load(file)
        self._tags = [tag.replace("_", " ") for tag in tags.keys()]

    async def generate(self, image_path: Path, **kwargs) -> str:
        """Generate tags for an image using JTP2"""
        try:
            self._initialize()
            return await run_in_executor(self._generate_sync, image_path)
        except RuntimeError as e:
            logger.error(f"JTP2 initialization error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error generating caption with JTP2: {e}", exc_info=True)
            raise

    def _generate_sync(self, image_path: Path) -> str:
        """Synchronous implementation of tag generation"""
        # Process image
        image = Image.open(image_path)
        img = image.convert('RGBA')
        tensor = self._transform(img).unsqueeze(0)

        if torch.cuda.is_available() and not self.force_cpu:
            tensor = tensor.cuda()
            if torch.cuda.get_device_capability()[0] >= 7:
                tensor = tensor.to(dtype=torch.float16, memory_format=torch.channels_last)

        # Run inference
        with torch.no_grad():
            probits = self._model(tensor)[0].cpu()
            values, indices = probits.topk(250)

        # Process results
        tag_score = {
            self._tags[indices[i]]: values[i].item() 
            for i in range(indices.size(0))
        }
        filtered_tags = [
            tag for tag, score in tag_score.items() 
            if score > self.threshold
        ]
        
        return ", ".join(filtered_tags)
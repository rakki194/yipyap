// src/components/ImageViewer/ImageInfo.tsx
import { formatFileSize } from "../../utils/format";
import type { ImageData } from "../../resources/browse";

interface ImageInfoProps {
  image: ImageData;
}

export const ImageInfo = (props: ImageInfoProps) => {
  return (
    <div class="metadata">
      <p>Size: {formatFileSize(props.image.size)}</p>
      <p>Modified: {new Date(props.image.mtime).toLocaleString()}</p>
      <p>Type: {props.image.mime}</p>
      <p>
        Dimensions: {props.image.width}×{props.image.height}
      </p>
    </div>
  );
};

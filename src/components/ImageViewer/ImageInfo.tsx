// src/components/ImageViewer/ImageInfo.tsx
import { formatFileSize } from '../../utils/format';
import type { ImageInfo as ImageInfoType } from '../../types';

interface ImageInfoProps {
  image: ImageInfoType;
}

export const ImageInfo = (props: ImageInfoProps) => {
  return (
    <div class="metadata">
      <p>Size: {formatFileSize(props.image.size)}</p>
      <p>Modified: {props.image.modified}</p>
      <p>Type: {props.image.mime}</p>
      <p>Dimensions: {props.image.width}×{props.image.height}</p>
    </div>
  );
};
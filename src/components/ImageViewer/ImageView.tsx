// src/components/ImageViewer/ImageView.tsx
import { onMount } from 'solid-js';
import type { ImageInfo } from '../../types';

interface ImageViewProps {
  image: ImageInfo;
}

export const ImageView = (props: ImageViewProps) => {
  let imgRef: HTMLImageElement;

  onMount(() => {
    if (imgRef.complete) {
      imgRef.classList.add('loaded');
    }
  });

  return (
    <img 
      ref={imgRef!}
      src={`/preview/${props.image.path}`} 
      alt={props.image.name}
      onLoad={(e) => e.currentTarget.classList.add('loaded')}
    />
  );
};
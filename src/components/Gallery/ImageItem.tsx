// src/components/Gallery/ImageItem.tsx
import { onMount } from 'solid-js';
import type { ImageInfo } from '../../types';
import { formatFileSize } from '../../utils/format';

interface ImageItemProps {
  item: ImageInfo;
  onClick: () => void;
}

export const ImageItem = (props: ImageItemProps) => {
  let imgRef: HTMLImageElement;

  onMount(() => {
    if (imgRef.complete) {
      imgRef.classList.add('loaded');
    }
  });

  return (
    <div 
      class="item image" 
      onClick={props.onClick}
      data-aspect-ratio={props.item.aspect_ratio}
    >
      <div 
        class="thumbnail-wrapper" 
        style={{
          '--aspect-ratio': props.item.aspect_ratio,
          'min-height': '100px',
          'position': 'relative'
        }}
      >
        <img 
          ref={imgRef!}
          src={`/thumbnail/${props.item.thumbnail_path}`}
          alt={props.item.name}
          loading="lazy"
          width={props.item.thumbnail_width}
          height={props.item.thumbnail_height}
          style={{
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'object-fit': 'cover'
          }}
          onLoad={(e) => e.currentTarget.classList.add('loaded')}
        />
      </div>
      <div class="info">
        <div class="name">{props.item.name}</div>
        <div class="meta">{formatFileSize(props.item.size)}</div>
      </div>
    </div>
  );
};
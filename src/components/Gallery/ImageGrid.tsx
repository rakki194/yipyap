// src/components/Gallery/ImageGrid.tsx
import { For } from 'solid-js';
import { DirectoryItem } from './DirectoryItem';
import { ImageItem } from './ImageItem';
import type { ImageInfo, DirectoryItem as DirectoryItemType } from '../../types';

interface ImageGridProps {
  items: (ImageInfo | DirectoryItemType)[];
  onImageClick: (image: ImageInfo) => void;
  gridRef: (el: HTMLDivElement) => void;
  parentPath: string;
  currentPath: string;
}

export const ImageGrid = (props: ImageGridProps) => {
  return (
    <div class="responsive-grid" ref={props.gridRef}>
      <For each={props.items}>
        {(item) => (
          item.type === 'directory' ? (
            <DirectoryItem 
              path={item.path} 
              name={item.name} 
              isParent={item.name === '..'}
            />
          ) : (
            <ImageItem 
              item={item} 
              onClick={() => props.onImageClick(item)}
            />
          )
        )}
      </For>
    </div>
  );
};
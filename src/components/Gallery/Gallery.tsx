// src/components/Gallery/Gallery.tsx
import { createSignal, onMount, onCleanup } from 'solid-js';
import { Controls } from './Controls';
import { ImageGrid } from './ImageGrid';
import { Pagination } from './Pagination';
import { ImageModal } from '../ImageViewer/ImageModal';
import type { ImageInfo, DirectoryItem } from '../../types';

interface GalleryProps {
  currentPath: string;
  parentPath: string;
  items: (ImageInfo | DirectoryItem)[];
  viewMode: 'grid' | 'list';
  currentSort: 'name' | 'date' | 'size';
  currentSearch: string;
  currentPage: number;
  totalPages: number;
  onSearch: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (sort: 'name' | 'date' | 'size') => void;
  onPageChange: (page: number) => void;
}

export const Gallery = (props: GalleryProps) => {
  const [selectedImage, setSelectedImage] = createSignal<ImageInfo | null>(null);
  let gridRef: HTMLDivElement | undefined;

  onMount(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const minWidth = 200;
        const gap = 16;
        const columns = Math.max(1, Math.floor((width + gap) / (minWidth + gap)));
        
        if (gridRef) {
          gridRef.style.setProperty('--columns', columns.toString());
          const itemWidth = (width - (gap * (columns - 1))) / columns;
          gridRef.style.setProperty('--item-width', `${itemWidth}px`);
        }
      }
    });
    
    if (gridRef) {
      resizeObserver.observe(gridRef);
    }
    onCleanup(() => resizeObserver.disconnect());
  });

  return (
    <>
      <Controls 
        currentPath={props.currentPath}
        currentSearch={props.currentSearch}
        viewMode={props.viewMode}
        currentSort={props.currentSort}
        onSearch={props.onSearch}
        onViewModeChange={props.onViewModeChange}
        onSortChange={props.onSortChange}
      />
      
      <div id="gallery" class={`gallery ${props.viewMode === 'list' ? 'list-view' : ''}`}>
        <ImageGrid
          items={props.items}
          onImageClick={setSelectedImage}
          gridRef={(el) => gridRef = el}
          parentPath={props.parentPath}
          currentPath={props.currentPath}
        />
      </div>

      <Pagination
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        onPageChange={props.onPageChange}
      />

      <ImageModal 
        image={selectedImage()} 
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};
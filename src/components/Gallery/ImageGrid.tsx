// src/components/Gallery/ImageGrid.tsx
import { For, onCleanup, onMount, Show, createSignal, createMemo, createEffect } from "solid-js";
import { A } from "@solidjs/router";

import { useGallery } from "~/contexts/GalleryContext";
import { formatFileSize } from "~/utils/format";
import { joinUrlParts } from "~/utils";
import { measure_columns } from "~/directives";
import getIcon, { captionIconsMap } from "~/icons";
import type { AnyItem } from "~/resources/browse";
import type {
  ImageItem as ImageItemType,
  BrowsePagesCached,
} from "~/resources/browse";
import { useAppContext } from "~/contexts/app";

/**
 * Grid component that displays images and directories in a responsive layout
 * 
 * Features:
 * - Responsive grid layout with dynamic column count
 * - Intersection observer for infinite scrolling
 * - Directory navigation
 * - Selection highlighting
 * - Thumbnail loading states
 * 
 * @component
 * @param props.data - Browse data containing items and metadata
 * @param props.items - Array of items (images/directories) to display
 * @param props.path - Current directory path
 * @param props.onImageClick - Callback for image selection
 */
export const ImageGrid = (props: {
  data: BrowsePagesCached;
  items: AnyItem[];
  path: string;
  onImageClick: (idx: number) => void;
}) => {
  const gallery = useGallery();
  const setColumns = gallery.selection.setColumns;
  const addObserved = makeIntersectionObserver(gallery.setPage);
  const app = useAppContext();

  // Add debug logging for props
  createEffect(() => {
    console.debug('ImageGrid received props:', {
      path: props.path,
      itemCount: props.items?.length,
      hasData: !!props.data
    });
  });

  const isActive = (ref: HTMLElement, idx: number) => {
    const isSelected = gallery.mode === "view" && gallery.selected === idx;
    if (isSelected) {
      // Only scroll if this is a new selection
      const lastSelected = ref.getAttribute('data-last-selected') === 'true';
      if (!lastSelected) {
        ref.setAttribute('data-last-selected', 'true');
        ref.scrollIntoView({ 
          behavior: "smooth", 
          block: "center", 
          inline: "nearest"
        });
      }
      return true;
    }
    ref.removeAttribute('data-last-selected');
    return false;
  };

  const gridStyle = createMemo(() => ({
    "grid-template-columns": `repeat(auto-fill, minmax(${app.thumbnailSize}px, 1fr))`,
  }));

  return (
    <div 
      class="responsive-grid" 
      style={gridStyle()} 
      use:measure_columns={setColumns}
      role="grid"
      aria-label="Image gallery grid"
      aria-describedby="gallery-description"
    >
      <div id="gallery-description" class="sr-only">
        Grid of images and folders. Use arrow keys to navigate, space to select, and enter to open.
      </div>
      <div 
        role="status" 
        aria-live="polite" 
        class="sr-only"
      >
        {props.items.length} items loaded
      </div>
      <Show when={props.path}>
        <DirectoryItem
          name=".."
          path={props.path}
          selected={gallery.selected === null}
          idx={-1}
        />
      </Show>
      <For each={props.items}>
        {(item, getIdx) => {
          //console.debug('Rendering item:', {
          //  type: item.type,
          //  fileName: item.file_name,
          //  idx: getIdx()
          //});
          let ref!: HTMLElement;
          const next_page = item.next_page;
          if (next_page !== undefined) {
            onMount(() => addObserved(ref, next_page));
          }
          return item.type === "image" ? (
            <ImageItem
              ref={ref as HTMLDivElement}
              item={item}
              idx={getIdx()}
              path={props.path}
              selected={isActive(ref, getIdx())}
              onClick={() => {
                props.onImageClick(getIdx());
                gallery.select(getIdx());
              }}
            />
          ) : (
            <DirectoryItem
              ref={ref as HTMLAnchorElement}
              name={item.file_name}
              path={props.path}
              selected={isActive(ref, getIdx())}
              idx={getIdx()}
            />
          );
        }}
      </For>
    </div>
  );
};

/**
 * Creates an intersection observer for infinite scrolling functionality
 * 
 * @param callback - Function to call when element becomes visible
 * @param options - IntersectionObserver configuration options
 * @returns Function to add elements to observation
 */
function makeIntersectionObserver<T>(
  callback: (assoc_value: T) => void,
  options: IntersectionObserverInit = {
    rootMargin: "0px",
    threshold: 0.01,
  }
): (el: Element, assoc_value: T) => void {
  const [currentPage, setCurrentPage] = createSignal(1);
  
  // Dynamic root margin based on page
  const getRootMargin = (page: number) => {
    if (page === 1) return "100px"; // Small margin for initial fast load
    if (page === 2) return "800px"; // Larger margin for second batch
    return "9600px"; // Much larger margin for subsequent batches
  };

  let observer: IntersectionObserver | null = null;
  const observed = new WeakMap<Element, T>();
  const pending = new Set<Element>();

  const tryLoadPending = () => {
    if (pending.size === 0) return;

    // Update observer with new root margin when page changes
    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const value = observed.get(el);
          if (value !== undefined) {
            callback(value);
            observer?.unobserve(el);
            observed.delete(el);
          }
        }
      }
    }, {
      ...options,
      rootMargin: getRootMargin(currentPage())
    });

    for (const el of pending) {
      const value = observed.get(el);
      if (value !== undefined) {
        observer.observe(el);
      }
      pending.delete(el);
    }
  };

  const addObserved = (el: Element, assoc_value: T) => {
    observed.set(el, assoc_value);
    pending.add(el);
    tryLoadPending();
    
    // Update page number when loading more
    setCurrentPage(p => p + 1);
  };

  onCleanup(() => {
    observer?.disconnect();
  });

  return addObserved;
}

/**
 * Individual image item component displaying thumbnail and metadata
 * 
 * Features:
 * - Thumbnail loading states
 * - Metadata overlay (dimensions, size, captions)
 * - Selection highlighting
 * - Multi-selection support
 * - Caption icons
 * 
 * @component
 * @param props.ref - Reference to the DOM element
 * @param props.item - Image item data
 * @param props.idx - Index in the grid
 * @param props.path - Current directory path
 * @param props.onClick - Click handler
 * @param props.selected - Whether item is currently selected
 */
export const ImageItem = (props: {
  ref: HTMLDivElement;
  item: ImageItemType;
  idx: number;
  path: string;
  onClick: () => void;
  selected: boolean;
}) => {
  const gallery = useGallery();
  const { getThumbnailSize } = gallery;
  const [isLoading, setIsLoading] = createSignal(true);
  const isMultiSelected = () => gallery.selection.multiSelected.has(props.idx);
  
  // Calculate aspect ratio based on image dimensions
  const aspectRatio = createMemo(() => 1);

  // Calculate height based on thumbnail size and aspect ratio
  const imageHeight = createMemo(() => {
    const size = getThumbnailSize({ width: 300, height: 300 });
    return size.width;
  });

  const containerStyle = createMemo(() => ({
    // Fixed square aspect ratio
    "aspect-ratio": "1",
    "height": `${imageHeight()}px`,
    "display": "flex",
    "align-items": "center",
    "justify-content": "center",
    "overflow": "hidden"
  }));

  const handleClick = (e: MouseEvent) => {
    
    if (e.ctrlKey || e.metaKey) {
      gallery.selection.toggleMultiSelect(props.idx);
    } else {
      props.onClick();
    }
  };

  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    if (!e.dataTransfer) return;

    const target = e.currentTarget as HTMLElement;
    target.classList.add('being-dragged');

    // If this item is part of a multi-selection, include all selected items
    if (isMultiSelected()) {
      const selectedItems = Array.from(gallery.selection.multiSelected)
        .map(idx => {
          const data = gallery.data();
          if (!data) return null;
          const item = data.items[idx as number];
          if (item?.type !== 'image') return null;
          return {
            type: 'image',
            path: props.path,
            name: item.file_name,
            idx
          };
        })
        .filter(Boolean);
      e.dataTransfer.setData('application/x-yipyap-items', JSON.stringify(selectedItems));
      e.dataTransfer.setData('application/x-yipyap-item', JSON.stringify({
        type: 'image',
        path: props.path,
        name: props.item.file_name,
        idx: props.idx
      }));

      // Add being-dragged class to all selected items (both images and folders)
      document.querySelectorAll('.item').forEach(el => {
        const idx = parseInt(el.getAttribute('data-idx') || '');
        if (!isNaN(idx) && (
          gallery.selection.multiSelected.has(idx) || 
          gallery.selection.multiFolderSelected.has(idx)
        )) {
          el.classList.add('being-dragged');
        }
      });
    } else {
      // Single item drag
      e.dataTransfer.setData('application/x-yipyap-item', JSON.stringify({
        type: 'image',
        path: props.path,
        name: props.item.file_name,
        idx: props.idx
      }));
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: DragEvent) => {
    // Remove being-dragged class from all items
    document.querySelectorAll('.being-dragged').forEach(el => {
      el.classList.remove('being-dragged');
    });
  };

  return (
    <div
      ref={props.ref}
      class="item image"
      classList={{ 
        selected: props.selected,
        "multi-selected": isMultiSelected()
      }}
      onClick={handleClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-idx={props.idx}
      role="gridcell"
      aria-selected={props.selected || isMultiSelected()}
      aria-label={`Image: ${props.item.file_name}`}
      aria-describedby={`image-details-${props.idx}`}
      style={containerStyle()}
    >
      <Show when={props.item()} keyed>
        {(item) => {
          const thumbnailPath = joinUrlParts("/thumbnail", props.path, item.name);
          const aspectRatio = item.width / item.height;
          const { width, height } = getThumbnailSize(item);

          let imgRef!: HTMLImageElement;
          onMount(() => {
            if (imgRef.complete) {
              setIsLoading(false);
            }
          });

          return (
            <>
              <img
                ref={imgRef}
                src={thumbnailPath}
                width={width}
                height={height}
                style={{
                  "object-position": aspectRatio > 1 ? "center" : "top",
                }}
                classList={{ loaded: !isLoading() }}
                onLoad={() => setIsLoading(false)}
                alt={`Thumbnail of ${item.name}`}
                aria-busy={isLoading()}
              />
              <Show when={isLoading()}>
                <div class="spin-icon" role="status" aria-live="polite">
                  <span class="icon" aria-hidden="true">{getIcon("spinner")}</span>
                  <span class="sr-only">Loading image...</span>
                </div>
              </Show>
            </>
          );
        }}
      </Show>
      <div class="overlay" id={`image-details-${props.idx}`}>
        <p>{props.item.file_name}</p>
        <Show when={props.item()} keyed>
          {(item) => (
            <>
              <p>
                {item.width}x{item.height} {formatFileSize(item.size)}
              </p>
              <p>
                <For each={item.captions.map((c) => c[0]).toSorted()}>
                  {(c) => (
                    <span class="icon" title={c} role="img" aria-label={c}>
                      {getIcon(
                        captionIconsMap[c as keyof typeof captionIconsMap]
                      )}
                    </span>
                  )}
                </For>
              </p>
            </>
          )}
        </Show>
      </div>
      <Show when={isMultiSelected()}>
        <div class="multi-select-indicator" aria-hidden="true">
          <span class="icon">{getIcon("check")}</span>
        </div>
      </Show>
    </div>
  );
};

export const DirectoryItem = (props: {
  ref?: HTMLAnchorElement;
  path: string;
  name: string;
  selected: boolean;
  idx: number;
}) => {
  const gallery = useGallery();
  const isMultiSelected = () => gallery.selection.multiFolderSelected.has(props.idx);

  const handleClick = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (props.name !== "..") {
        gallery.selection.toggleFolderMultiSelect(props.idx);
      }
    } else {
      if (props.name === "..") {
        // For parent directory navigation, don't set selection to null
        // Just let the default navigation handle it
        return;
      }
      gallery.select(props.idx);
    }
  };

  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    if (!e.dataTransfer) return;

    const target = e.currentTarget as HTMLElement;
    target.classList.add('being-dragged');

    // If this folder is part of a multi-selection, include all selected folders
    if (isMultiSelected()) {
      const selectedItems = Array.from(gallery.selection.multiFolderSelected)
        .map(idx => {
          const data = gallery.data();
          if (!data) return null;
          const item = data.items[idx as number];
          if (item?.type !== 'directory') return null;
          return {
            type: 'directory',
            path: props.path,
            name: item.file_name,
            idx
          };
        })
        .filter(Boolean);
      e.dataTransfer.setData('application/x-yipyap-items', JSON.stringify(selectedItems));
      e.dataTransfer.setData('application/x-yipyap-item', JSON.stringify({
        type: 'directory',
        path: props.path,
        name: props.name,
        idx: props.idx
      }));

      // Add being-dragged class to all selected items (both images and folders)
      document.querySelectorAll('.item').forEach(el => {
        const idx = parseInt(el.getAttribute('data-idx') || '');
        if (!isNaN(idx) && (
          gallery.selection.multiSelected.has(idx) || 
          gallery.selection.multiFolderSelected.has(idx)
        )) {
          el.classList.add('being-dragged');
        }
      });
    } else {
      // Single item drag
      e.dataTransfer.setData('application/x-yipyap-item', JSON.stringify({
        type: 'directory',
        path: props.path,
        name: props.name,
        idx: props.idx
      }));
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: DragEvent) => {
    // Remove being-dragged class from all items
    document.querySelectorAll('.being-dragged').forEach(el => {
      el.classList.remove('being-dragged');
    });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer) return;

    if (e.dataTransfer.types.includes('application/x-yipyap-item') ||
        e.dataTransfer.types.includes('application/x-yipyap-items')) {
      e.dataTransfer.dropEffect = 'move';
      const target = e.currentTarget as HTMLElement;
      target.classList.add('drag-target');
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-target');
  };

  const fullPath = props.path
    ? `${props.path}/${props.name}`
    : props.name;

  return (
    <A
      ref={props.ref}
      href={props.name === ".." ? `/${props.path.split("/").slice(0, -1).join("/")}` : `/${fullPath}`}
      class="item directory"
      classList={{ 
        selected: props.selected,
        "multi-selected": isMultiSelected()
      }}
      onClick={handleClick}
      draggable={props.name !== ".."}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      data-path={props.path}
      data-name={props.name}
      data-idx={props.idx}
      role="gridcell"
      aria-selected={props.selected || isMultiSelected()}
      aria-label={`Folder: ${props.name}`}
    >
      <Show when={isMultiSelected()}>
        <div class="multi-select-indicator" aria-hidden="true">
          <span class="icon">{getIcon("check")}</span>
        </div>
      </Show>
      <span class="icon directory-icon" aria-hidden="true">
        {getIcon(props.name === ".." ? "folderArrowUp" : "folder")}
      </span>
      <span class="directory-name" id={`dir-details-${props.idx}`}>
        {props.name}
      </span>
    </A>
  );
};

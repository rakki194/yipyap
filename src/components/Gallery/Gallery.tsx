// src/components/Gallery/Gallery.tsx
import {
  createSignal,
  onMount,
  onCleanup,
  createEffect,
  Accessor,
} from "solid-js";
import { createElementSize } from "@solid-primitives/resize-observer";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "../../contexts/GalleryContext";
import { ImageItem, NameToItem } from "../../resources/browse";

interface GalleryProps {
  items: NameToItem;
  path: string;
}

export const Gallery = (props: GalleryProps) => {
  const { state, windowSize, actions } = useGallery();
  const [editedImage, setEditedImage] = createSignal<ImageItem | null>(null);
  let gridRef: HTMLDivElement | undefined;

  createEffect(() => {
    console.log("Gallery -> editedImage", editedImage());
  });

  onMount(() => {
    createEffect(() => {
      if (!gridRef) return;
      const width = windowSize.width;

      const minWidth = 200;
      const gap = 16;
      const columns = Math.max(1, Math.floor((width + gap) / (minWidth + gap)));
      const itemWidth = (windowSize.width - gap * (columns - 1)) / columns;

      console.log("createElementSize -> size", gridRef, {
        ...windowSize,
        columns,
        itemWidth,
      });

      gridRef.style.setProperty("--columns", columns.toString());
      // gridRef.style.setProperty('--item-width', `${itemWidth}px`);
    });
  });

  /**
   * Sets up a ResizeObserver to dynamically adjust the grid layout
   * based on the width of the gallery container. It calculates the
   * number of columns and the item width whenever the container is resized.
   *
   * The observer is disconnected when the component is unmounted to
   * prevent memory leaks.
   */
  // onMount(() => {
  //   const resizeObserver = new ResizeObserver(entries => {
  //     for (const entry of entries) {
  //       const width = entry.contentRect.width;
  //       const minWidth = 200;
  //       const gap = 16;
  //       const columns = Math.max(1, Math.floor((width + gap) / (minWidth + gap)));

  //       if (gridRef) {
  //         gridRef.style.setProperty('--columns', columns.toString());
  //         const itemWidth = (width - (gap * (columns - 1))) / columns;
  //         gridRef.style.setProperty('--item-width', `${itemWidth}px`);
  //       }
  //     }
  //   });

  //   if (gridRef) {
  //     resizeObserver.observe(gridRef);
  //   }
  //   onCleanup(() => resizeObserver.disconnect());
  // });

  return (
    <>
      <Controls />

      <div
        id="gallery"
        class={`gallery ${state.viewMode === "list" ? "list-view" : ""}`}
      >
        <ImageGrid
          items={props.items}
          path={props.path}
          onImageClick={setEditedImage}
          gridRef={(el) => (gridRef = el)}
        />
      </div>

      <ImageModal
        path={props.path}
        image={editedImage()}
        onClose={() => setEditedImage(null)}
      />
    </>
  );
};

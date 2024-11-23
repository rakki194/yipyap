// src/components/Gallery/Gallery.tsx
import { createSignal, createEffect, Show } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import type { ImageItem } from "~/resources/browse";

export const Gallery = () => {
  const { state, windowSize, actions, data, params } = useGallery();
  const [editedImage, setEditedImage] = createSignal<ImageItem | null>(null);
  let gridRef: HTMLDivElement | undefined;

  createEffect(() => {
    console.log("Gallery -> editedImage", editedImage());
  });

  return (
    <>
      <Controls />
      <Show when={data()} fallback={<div>Loading {params.path}...</div>}>
        {(data) => (
          <>
            <div
              id="gallery"
              class={`gallery ${state.viewMode === "list" ? "list-view" : ""}`}
            >
              <ImageGrid
                items={data().items}
                path={params.path}
                onImageClick={setEditedImage}
                gridRef={(el) => (gridRef = el)}
              />
            </div>

            <ImageModal
              path={params.path}
              image={editedImage()}
              onClose={() => setEditedImage(null)}
            />
          </>
        )}
      </Show>
    </>
  );
};

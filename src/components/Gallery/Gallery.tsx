// src/components/Gallery/Gallery.tsx
import { createSignal, createEffect, Show } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import type { ImageItem } from "~/resources/browse";
import { createShortcut } from "@solid-primitives/keyboard";

export const Gallery = () => {
  const { state, windowSize, actions, data, params } = useGallery();
  let gridRef: HTMLDivElement | undefined;

  createShortcut(["ArrowRight"], actions.selectNext);
  createShortcut(["ArrowLeft"], actions.selectPrev);
  createShortcut(["Enter"], actions.toggleEdit);

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
                onImageClick={actions.edit}
                gridRef={(el) => (gridRef = el)}
              />
            </div>

            <ImageModal
              path={params.path}
              image={actions.editedImage}
              onClose={() => actions.setMode("view")}
            />
          </>
        )}
      </Show>
    </>
  );
};

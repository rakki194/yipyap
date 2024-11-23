// src/components/Gallery/Gallery.tsx
import { createSignal, createEffect, Show } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import type { ImageItem } from "~/resources/browse";
import { createShortcut } from "@solid-primitives/keyboard";

export const Gallery = () => {
  const gallery = useGallery();
  let gridRef: HTMLDivElement | undefined;

  createShortcut(["ArrowRight"], gallery.selectNext);
  createShortcut(["ArrowLeft"], gallery.selectPrev);
  createShortcut(["Enter"], gallery.toggleEdit);

  return (
    <>
      <Controls />
      <Show
        when={gallery.data()}
        fallback={<div>Loading {gallery.params.path}...</div>}
      >
        {(data) => (
          <>
            <div
              id="gallery"
              class={`gallery ${
                gallery.state.viewMode === "list" ? "list-view" : ""
              }`}
            >
              <ImageGrid
                items={data().items}
                path={gallery.params.path}
                onImageClick={gallery.edit}
                gridRef={(el) => (gridRef = el)}
              />
            </div>
            <Show when={gallery.editedImage && gallery.editedImage}>
              {(image) => (
                <ImageModal
                  image={image()}
                  path={gallery.params.path}
                  onClose={() => gallery.setMode("view")}
                />
              )}
            </Show>
          </>
        )}
      </Show>
    </>
  );
};

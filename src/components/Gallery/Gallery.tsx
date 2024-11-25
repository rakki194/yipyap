// src/components/Gallery/Gallery.tsx
import { Show, onMount, onCleanup } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import { useAction } from "@solidjs/router";

export const Gallery = () => {
  const gallery = useGallery();
  const deleteImageAction = useAction(gallery.deleteImage);

  const keyDownHandler = (event: KeyboardEvent) => {
    if (!event) return;

    // Don't act if a input element is focused
    const activeElement = document.activeElement as HTMLElement;
    if (
      activeElement &&
      (activeElement.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(activeElement.tagName))
    ) {
      return;
    }

    // console.log(
    //   "keyDownEvent",
    //   event,
    //   activeElement &&
    //     (activeElement.isContentEditable ||
    //       ["INPUT", "TEXTAREA"].includes(activeElement.tagName))
    // );

    // Don't act if a modifier key is pressed
    if (event.shiftKey || event.altKey || event.ctrlKey) {
      return;
    }

    if (event.key === "ArrowRight") {
      gallery.selectNext();
    } else if (event.key === "ArrowLeft") {
      gallery.selectPrev();
    } else if (event.key === "Enter") {
      gallery.toggleEdit();
    } else if (event.key === "Escape") {
      gallery.setMode("view");
    } else if (event.key === "Delete" && gallery.selectedImage) {
      gallery.selected !== null && deleteImageAction(gallery.selected);
    } else {
      return;
    }
    event.preventDefault();
  };

  onMount(() => {
    window.addEventListener("keydown", keyDownHandler);
    onCleanup(() => window.removeEventListener("keydown", keyDownHandler));
  });

  return (
    <>
      <Controls />

      <div
        id="gallery"
        class={`gallery ${
          gallery.state.viewMode === "list" ? "list-view" : ""
        }`}
      >
        <ImageGrid data={gallery.data()} onImageClick={gallery.edit} />
      </div>
      <Show when={gallery.editedImage}>
        {(image) => (
          <ImageModal image={image()} onClose={() => gallery.setMode("view")} />
        )}
      </Show>
    </>
  );
};

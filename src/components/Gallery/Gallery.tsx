// src/components/Gallery/Gallery.tsx
import { Show, onMount, onCleanup, createSignal } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import { useAction, useNavigate } from "@solidjs/router";
import "./Gallery.css";
import { QuickJump } from "./QuickJump";

export const Gallery = () => {
  const navigate = useNavigate();
  const gallery = useGallery();
  const deleteImageAction = useAction(gallery.deleteImage);
  const [showQuickJump, setShowQuickJump] = createSignal(false);

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

    // Don't act if a modifier key is pressed
    if (event.shiftKey || event.altKey || event.ctrlKey) {
      return;
    }

    const data = gallery.data();
    if (!data) return;

    if (event.key === "ArrowRight") {
      if (!gallery.selectNext()) return;
    } else if (event.key === "ArrowLeft") {
      if (!gallery.selectPrev()) return;
    } else if (event.key === "ArrowDown") {
      if (!gallery.selectDown()) return;
    } else if (event.key === "ArrowUp") {
      if (!gallery.selectUp()) return;
    } else if (event.key === "Enter" && gallery.selected !== null) {
      const selected = data.items[gallery.selected];
      if (selected.type === "directory") {
        navigate(`/gallery/${data.path}/${selected.file_name}`);
      } else {
        if (!gallery.toggleEdit()) return;
      }
    } else if (event.key === "Escape") {
      if (!gallery.setMode("view")) return;
    } else if (event.key === "Backspace") {
      const segments = data.path.split("/");
      if (segments.length < 1) return;
      navigate(`/gallery/${segments.slice(0, -1).join("/")}`);
    } else if (event.key === "Delete" && gallery.selectedImage !== null) {
      deleteImageAction(gallery.selected!);
    } else if (event.key === "q") {
      setShowQuickJump(true);
      event.preventDefault();
      return;
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
        <Show when={gallery.data()}>
          {(data) => <ImageGrid data={data()} onImageClick={gallery.edit} />}
        </Show>
      </div>

      <Show when={gallery.editedImage}>
        {(image) => (
          /* FIXME: this is messy, we should just pass the imageInfo,
        but the captions might change more often */ <ImageModal
            imageInfo={gallery.getEditedImage()!}
            captions={image().captions}
            onClose={() => gallery.setMode("view")}
          />
        )}
      </Show>
      <Show when={showQuickJump()}>
        <QuickJump onClose={() => setShowQuickJump(false)} />
      </Show>
    </>
  );
};

// src/components/Gallery/Gallery.tsx
import { Show, onMount, onCleanup, createSignal, createMemo } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import { useAction, useNavigate } from "@solidjs/router";
import "./Gallery.css";
import { QuickJump } from "./QuickJump";
import { useAppContext } from "~/contexts/app";

export const Gallery = () => {
  const navigate = useNavigate();
  const gallery = useGallery();
  const appContext = useAppContext();
  const deleteImageAction = useAction(gallery.deleteImage);
  const [showQuickJump, setShowQuickJump] = createSignal(false);

  const keyDownHandler = (event: KeyboardEvent) => {
    // Returns when we don't act on the event, preventDefault for acted-upon event, present in the epilogue.
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
    } else if (event.key === "Enter") {
      // Don't intercept if no selection and in root directory
      if (gallery.selected === null && data.path === "") return;

      const selImageItem =
        gallery.selected !== null
          ? data.items[gallery.selected]
          : { type: "directory", file_name: ".." };
      if (selImageItem.type === "directory") {
        navigate(`/gallery/${data.path}/${selImageItem.file_name}`);
      } else {
        if (!gallery.toggleEdit()) return;
      }
    } else if (event.key === "Escape") {
      if (gallery.mode === "view") {
        if (gallery.selected === null) {
          gallery.select(null);
        } else return;
      }
      if (!gallery.setMode("view")) return;
    } else if (event.key === "Backspace") {
      const segments = data.path.split("/");
      if (segments.length < 1) return;
      navigate(`/gallery/${segments.slice(0, -1).join("/")}`);
    } else if (event.key === "Delete" && gallery.selectedImage !== null) {
      const data = gallery.data();
      if (!data) return;
      const imagePath = data.path
        ? `${data.path}/${gallery.selectedImage.name}`
        : gallery.selectedImage.name;
      deleteImage(imagePath);
    } else if (event.key === "q") {
      setShowQuickJump(true);
      event.preventDefault();
      return;
    } else {
      return;
    }
    event.preventDefault();
  };

  const deleteImage = async (imagePath: string) => {
    const params = new URLSearchParams();
    params.append("confirm", "true");

    // Include new settings
    if (appContext.preserveLatents) {
      params.append("preserve_latents", "true");
    }
    if (appContext.preserveTxt) {
      params.append("preserve_txt", "true");
    }

    try {
      const response = await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete image.");
      }
      // Refresh gallery or update UI as needed
    } catch (error) {
      console.error("Error deleting image:", error);
      // Handle error (e.g., show notification)
    }
  };

  onMount(() => {
    window.addEventListener("keydown", keyDownHandler);
    onCleanup(() => window.removeEventListener("keydown", keyDownHandler));
  });

  return (
    <>
      {/* <Controls /> */}

      <div id="gallery" class={"gallery"}>
        <Show when={gallery.data()}>
          {(data) => (
            <ImageGrid
              data={data()}
              items={data().items}
              path={data().path}
              onImageClick={gallery.edit}
            />
          )}
        </Show>
      </div>

      <Show when={gallery.getEditedImage()}>
        {(image) => (
          /* FIXME: this is messy, we should just pass the imageInfo,
        but the captions might change more often */ <ImageModal
            imageInfo={image()}
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

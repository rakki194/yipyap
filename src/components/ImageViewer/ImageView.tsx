// src/components/ImageViewer/ImageView.tsx
import { createEffect, createMemo, on, onMount, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { ImageInfo } from "~/types";

interface ImageViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  imageInfo: ImageInfo;
}

/**
 * An image viewer component that displays a preview and thumbnail image.
 * @param { image: ImageInfo } props - The props for the ImageView component.
 * @returns A JSX element representing the ImageView component.
 */
export const ImageView = (props: ImageViewProps) => {
  const [localProps, divProps] = splitProps(props, ["imageInfo"]);

  const fallback = createMemo(
    on(
      // ImageInfo contains all the updates for now
      () => localProps.imageInfo,
      (img, prev_img) => {
        if (prev_img && prev_img.download_path !== img.download_path) {
          prev_img.preview_img.setPriority("low");
          prev_img.thumbnail_img.setPriority("low");
        }
        if (img.preview_img.isLoaded()) {
          console.log("fallback: preview loaded");
          return null;
        } else {
          img.preview_img.setPriority("high");
          if (img.thumbnail_img.isLoaded()) {
            console.log("fallback: thumbnail loaded");
            return img.thumbnail_img.img;
          } else {
            console.log("fallback: spin");
            img.thumbnail_img.setPriority("high");
            return <span class="icon spin-icon" />;
          }
        }
      }
    )
  );

  onMount(() => {
    console.warn("image viewer mounted");
  });

  return (
    <div class="image-container" {...divProps}>
      {fallback()}
      {localProps.imageInfo.preview_img.img}
    </div>
  );
};

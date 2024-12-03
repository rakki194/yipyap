// src/components/ImageViewer/ImageView.tsx
import { splitProps } from "solid-js";
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

  return (
    <div class="image-container" {...divProps}>
      {localProps.imageInfo.preview_img.complete
        ? null
        : localProps.imageInfo.thumbnail_img}
      {localProps.imageInfo.preview_img}
    </div>
  );
};

// src/components/ImageViewer/ImageView.tsx
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount,
  Show,
  splitProps,
} from "solid-js";
import type { JSX } from "solid-js";
import { ImageData } from "~/resources/browse";
import { joinUrlParts, replaceExtension } from "~/utils";
import { SpinnerIcon } from "~/components/icons";
import type { ImageInfo } from "./ImageModal";

interface ImageViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  imageInfo: ImageInfo;
}

/**
 * An image viewer component that displays a preview and thumbnail image.
 * @param { image: ImageData, path: string } props - The props for the ImageView component.
 * @returns A JSX element representing the ImageView component.
 */
export const ImageView = (props: ImageViewProps) => {
  const [localProps, divProps] = splitProps(props, ["imageInfo"]);
  const [loaded, setLoaded] = createSignal(false);

  // The full version img element
  let previewRef: HTMLImageElement;
  // The container div element
  let ref!: HTMLDivElement;

  // The image changed, reset the state
  createEffect(
    on(
      () => localProps.imageInfo,
      () => {
        setLoaded(previewRef!.complete);
      }
    )
  );

  onMount(() => setLoaded(previewRef!.complete));

  return (
    <div class="image-container" ref={ref!} {...divProps}>
      {/* Spinner Overlay */}
      <Show when={!loaded()}>
        <span class="spin-icon icon" innerHTML={SpinnerIcon} />
      </Show>

      <img
        ref={previewRef!}
        class="preview"
        style={{
          "aspect-ratio": `${props.imageInfo.width} / ${props.imageInfo.height}`,
        }}
        classList={{
          loaded: loaded(),
        }}
        src={props.imageInfo.preview}
        alt={props.imageInfo.name}
        onLoad={() => setLoaded(true)}
      />

      <img
        class="thumbnail"
        style={{
          "aspect-ratio": `${props.imageInfo.width} / ${props.imageInfo.height}`,
        }}
        src={props.imageInfo.thumbnail}
        alt={props.imageInfo.name}
      />
    </div>
  );
};

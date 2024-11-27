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
interface ImageViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  image: ImageData;
  path: string;
}

/**
 * An image viewer component that displays a preview and thumbnail image.
 * @param { image: ImageData, path: string } props - The props for the ImageView component.
 * @returns A JSX element representing the ImageView component.
 */
export const ImageView = (props: ImageViewProps) => {
  const [localProps, divProps] = splitProps(props, ["image"]);
  const webpPathSegments = createMemo(() => {
    return [props.path, replaceExtension(localProps.image.name, ".webp")];
  });
  const [loaded, setLoaded] = createSignal(false);

  // The full version img element
  let previewRef: HTMLImageElement;
  // The container div element
  let ref!: HTMLDivElement;

  // The image changed, reset the state
  createEffect(
    on(
      () => localProps.image,
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
          "aspect-ratio": `${props.image.width} / ${props.image.height}`,
        }}
        classList={{
          loaded: loaded(),
        }}
        src={joinUrlParts("/preview", ...webpPathSegments())}
        alt={props.image.name}
        onLoad={() => setLoaded(true)}
      />

      <img
        class="thumbnail"
        style={{
          "aspect-ratio": `${props.image.width} / ${props.image.height}`,
        }}
        src={joinUrlParts("/thumbnail", ...webpPathSegments())}
        alt={props.image.name}
      />
    </div>
  );
};

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
import { useGallery } from "~/contexts/GalleryContext";
import { SpinnerIcon } from "~/components/icons";

interface ImageViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  image: ImageData;
}

export const ImageView = (props: ImageViewProps) => {
  const gallery = useGallery();

  const [localProps, divProps] = splitProps(props, ["image"]);
  const webpPath = createMemo(() => {
    let webpName = localProps.image.name.replace(/\.\w+$/, ".webp");
    return `${gallery.params.path}/${webpName}`;
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
        src={`/preview/${webpPath()}`}
        alt={props.image.name}
        onLoad={() => setLoaded(true)}
      />

      <img
        class="thumbnail"
        style={{
          "aspect-ratio": `${props.image.width} / ${props.image.height}`,
        }}
        src={`/thumbnail/${webpPath()}`}
        alt={props.image.name}
      />
    </div>
  );
};

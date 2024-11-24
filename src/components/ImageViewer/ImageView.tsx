// src/components/ImageViewer/ImageView.tsx
import { ImageData } from "~/resources/browse";
import { createEffect, createMemo, createSignal, on, onMount } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";

interface ImageViewProps {
  image: ImageData;
}

export const ImageView = (props: ImageViewProps) => {
  const gallery = useGallery();
  const webpPath = createMemo(() => {
    let webpName = props.image.name.replace(/\.\w+$/, ".webp");
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
      () => props.image,
      () => {
        // console.log('ImageView::name changed', {old, new: new_})
        setLoaded(previewRef!.complete);
      }
    )
  );

  onMount(() => setLoaded(previewRef!.complete));

  return (
    <div class="image-container" ref={ref!}>
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

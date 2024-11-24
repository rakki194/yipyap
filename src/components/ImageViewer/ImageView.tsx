// src/components/ImageViewer/ImageView.tsx
import { ImageData } from "~/resources/browse";
import { createEffect, createMemo, createSignal, on, onMount } from "solid-js";

interface ImageViewProps {
  path: string;
  image: ImageData;
}

export const ImageView = (props: ImageViewProps) => {
  const webpPath = createMemo(() => {
    let webpName = props.image.name.replace(/\.\w+$/, ".webp");
    return `${props.path}/${webpName}`;
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
        setLoaded(false);
      }
    )
  );

  onMount(() => {
    // console.log('ImageView::onMount', {...props, ref, previewRef, webpPath: webpPath()})
    if (previewRef!.complete) {
      setLoaded(true);
    }
  });

  const onPreviewLoad = () => {
    setLoaded(true);
  };

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
        onLoad={onPreviewLoad}
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

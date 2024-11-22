// src/components/ImageViewer/ImageView.tsx
import { ImageData } from "~/resources/browse";
import { createMemo, createSignal, onMount, Show } from "solid-js";

interface ImageViewProps {
  path: string;
  name: string;
  image: ImageData;
}

export const ImageView = (props: ImageViewProps) => {
  const webpPath = createMemo(() => {
    let webpName = props.name.replace(/\.\w+$/, ".webp");
    return `${props.path}/${webpName}`;
  });
  const [showThumbnail, setShowThumbnail] = createSignal(true);

  let previewRef: HTMLImageElement;
  let ref!: HTMLDivElement;

  const onPreviewLoad = () => {
    ref.classList.add("loaded");
    setTimeout(() => setShowThumbnail(false), 600);
  };

  onMount(() => {
    if (previewRef!.complete) {
      ref.classList.add("loaded");
      setShowThumbnail(false);
    }
  });

  return (
    <div class="image-container" ref={ref!}>
      <Show when={showThumbnail()}>
        <img
          class="thumbnail"
          src={`/thumbnail/${webpPath()}`}
          alt={props.name}
        />
      </Show>
      <img
        ref={previewRef!}
        class="preview"
        src={`/preview/${webpPath()}`}
        alt={props.name}
        onLoad={onPreviewLoad}
      />
    </div>
  );
};

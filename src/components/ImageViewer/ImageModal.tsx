// src/components/ImageViewer/ImageModal.tsx
import { createEffect, on, createMemo, createSignal, JSX } from "solid-js";
import { ImageView } from "./ImageView";
import { ImageInfo } from "./ImageInfo";
import { CaptionEditor } from "./CaptionEditor";
import type { ImageData } from "~/resources/browse";
import "./styles.css";
import { useGallery } from "~/contexts/GalleryContext";
import { DownloadIcon } from "~/components/icons";

interface ImageModalProps {
  path: string;
  image: ImageData;
  onClose: () => void;
}

export const ImageModal = (props: ImageModalProps) => {
  const gallery = useGallery();

  const getLayout = createMemo(() =>
    computeLayout(props.image, gallery.windowSize)
  );

  return (
    <div class="modal-content">
      <ModalHeader
        image={props.image}
        path={gallery.params.path}
        onClose={props.onClose}
      />
      <ModelBody
        image={props.image}
        path={gallery.params.path}
        layout={getLayout()}
      />
    </div>
  );
};

const ModelBody = (props: {
  path: string;
  image: ImageData;
  layout: LayoutInfo;
}) => {
  let refImageInfo!: HTMLDivElement;
  const [focused, setFocused] = createSignal(false);
  const [getStyle, setStyle] = createSignal<JSX.CSSProperties>();

  // Update the style of the image info based on the layout and focus
  createEffect(
    on([() => props.layout, focused], ([layout, focused], prev_input) => {
      if (!focused || (prev_input && layout !== prev_input[0])) {
        setStyle(undefined);
        return;
      }

      if (props.layout.layout === "horizontal") {
        const offset = props.layout.free_width - refImageInfo.offsetWidth;
        if (offset >= 0) {
          setStyle(undefined);
        } else {
          setStyle({
            transform: `translateX(${offset}px)`,
          });
        }
      } else {
        const offset = props.layout.free_height - refImageInfo.offsetHeight;
        if (offset >= 0) {
          setStyle(undefined);
        } else {
          setStyle({
            transform: `translateY(${offset}px)`,
          });
        }
      }
    })
  );

  return (
    <div class="modal-body" classList={{ [props.layout.layout]: true }}>
      <ImageView path={props.path} image={props.image} />

      <div
        class="image-info"
        ref={refImageInfo}
        tabIndex="0"
        style={getStyle()}
        onFocusIn={() => setFocused(true)}
        onFocusOut={() => setFocused(false)}
      >
        <ImageInfo image={props.image} />
        <CaptionEditor path={props.path} captions={props.image.captions} />
      </div>
    </div>
  );
};

const ModalHeader = (props: {
  image: ImageData;
  onClose: () => void;
  path: string;
}) => {
  return (
    <div class="modal-header">
      <h2>{props.image?.name}</h2>
      <div class="modal-actions">
        <a
          href={`/download/${props.path}/${props.image.name}`}
          class="download-btn"
          download
        >
          <div innerHTML={DownloadIcon} />
        </a>
        <button class="close" onClick={props.onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

type Size = { width: number; height: number };
type LayoutStr = "horizontal" | "vertical";
type LayoutInfo = Size & {
  scale: number;
  layout: LayoutStr;
  free_width: number;
  free_height: number;
};

function computeLayout(
  image: ImageData,
  windowSize: Readonly<Size>
): LayoutInfo {
  const { width: viewWidth, height: viewHeight } = windowSize;
  if (image === null) {
    //FIXME: we don't need this
    return {
      width: 0,
      height: 0,
      scale: 0,
      layout: "vertical",
      free_width: viewWidth,
      free_height: viewHeight,
    };
  }
  const { width: imageWidth, height: imageHeight } = image!;

  const width_scale = viewWidth / imageWidth;
  const height_scale = viewHeight / imageHeight;
  let scale: number;
  let layout: LayoutStr;
  if (width_scale < height_scale) {
    scale = width_scale;
    layout = "vertical";
  } else {
    scale = height_scale;
    layout = "horizontal";
  }
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const free_width = viewWidth - width;
  const free_height = viewHeight - height;

  return { width, height, scale, layout, free_width, free_height };
}

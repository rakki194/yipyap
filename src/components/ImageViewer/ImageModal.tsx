// src/components/ImageViewer/ImageModal.tsx
import { createMemo } from "solid-js";
import { createShortcut } from "@solid-primitives/keyboard";
import { ImageView } from "./ImageView";
import { ImageInfo } from "./ImageInfo";
import { CaptionEditor } from "./CaptionEditor";
import type { ImageData } from "~/resources/browse";
import "./styles.css";
import { useGallery } from "~/contexts/GalleryContext";

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

  createShortcut(["Escape"], () => props.onClose());

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
        layout={getLayout().layout}
      />
    </div>
  );
};

const ModelBody = (props: {
  path: string;
  image: ImageData;
  layout: LayoutStr;
}) => {
  const { windowSize } = useGallery();

  return (
    <div class="modal-body" classList={{ [props.layout]: true }}>
      <ImageView path={props.path} image={props.image} />

      {/* <div class="image-info">
        <ImageInfo image={props.image} />
        <CaptionEditor path={props.path} captions={props.image.captions} />
      </div> */}
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
          <i class="ri-download-line" />
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
type LayoutInfo = Size & { scale: number; layout: LayoutStr };

function computeLayout(
  image: ImageData,
  windowSize: Readonly<Size>
): LayoutInfo {
  if (image === null) {
    //FIXME: we don't need this
    return { width: 0, height: 0, scale: 0, layout: "vertical" };
  }
  const { width: viewWidth, height: viewHeight } = windowSize;
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

  return { width, height, scale, layout };
}

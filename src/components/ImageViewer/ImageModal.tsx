// src/components/ImageViewer/ImageModal.tsx
import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  JSX,
  Show,
} from "solid-js";
import Modal from "../Common/Modal";
import IconButton from "../Common/IconButton";
import { ImageView } from "./ImageView";
import { ImageInfo } from "./ImageInfo";
import { CaptionInput } from "./CaptionInput";
import { DownloadIcon, DismissIcon, DeleteIcon } from "~/icons";
import { useGallery } from "~/contexts/GalleryContext";
import { joinUrlParts, replaceExtension } from "~/utils";
import "./styles.css";
import { ImageData } from "~/resources/browse";

interface ImageModalProps {
  image: ImageData;
  path: string;
  isOpen: boolean;
  onClose: () => void;
}

export type ImageInfo = {
  name: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  mtime: string;
  preview: string;
  thumbnail: string;
  download: string;
};

export const ImageModal = (props: ImageModalProps) => {
  const { windowSize } = useGallery();
  const gallery = useGallery();
  const deleteImageAction = gallery.deleteImage;

  const getLayout = createMemo(() => computeLayout(props.image, windowSize));

  const imageInfo = createMemo((): ImageInfo => {
    const image = props.image;
    const name = image.name;
    const path = props.path;
    const webpName = replaceExtension(name, ".webp");
    return {
      name,
      width: image.width,
      height: image.height,
      size: image.size,
      mime: image.mime,
      mtime: image.mtime,
      preview: joinUrlParts("/preview", path, webpName),
      thumbnail: joinUrlParts("/preview", path, webpName),
      download: joinUrlParts("/download", path, name),
    };
  });

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={imageInfo().name}
    >
      <div class="modal-body" classList={{ [getLayout().layout]: true }}>
        <ImageView imageInfo={imageInfo()} onClick={props.onClose} />
        <div class="image-info">
          <ImageInfo imageInfo={imageInfo()} />
          <div class="caption-editor">
            <Index each={props.image.captions}>
              {(caption, idx) => (
                <CaptionInput
                  tabindex={idx + 1}
                  caption={caption()}
                  onClose={props.onClose}
                />
              )}
            </Index>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <IconButton
          icon={DownloadIcon}
          title="Download"
          onClick={() => {
            window.location.href = imageInfo().download;
          }}
        />
        <IconButton
          icon={DeleteIcon}
          title="Delete"
          onClick={() => {
            gallery.deleteImage(props.image.id).then(() => props.onClose());
          }}
        />
        <IconButton icon={DismissIcon} title="Close" onClick={props.onClose} />
      </div>
    </Modal>
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
  const { width: imageWidth, height: imageHeight } = image;

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

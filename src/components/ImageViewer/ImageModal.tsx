// src/components/ImageViewer/ImageModal.tsx
import {
  createEffect,
  on,
  createMemo,
  createSignal,
  Index,
  JSX,
} from "solid-js";
import { ImageView } from "./ImageView";
import { ImageInfo } from "./ImageInfo";
import { CaptionInput } from "./CaptionInput";
import "./styles.css";
import { useGallery } from "~/contexts/GalleryContext";
import { DownloadIcon, DismissIcon, DeleteIcon } from "~/icons";
import { useAction } from "@solidjs/router";
import type { ImageInfo as ImageInfoType, Captions } from "~/types";
import { useSettings } from "~/contexts/settings";

interface ImageModalProps {
  imageInfo: ImageInfoType;
  captions: Captions;
  onClose: () => void;
}

export const ImageModal = (props: ImageModalProps) => {
  const { windowSize } = useGallery();

  const getLayout = createMemo(() =>
    computeLayout(props.imageInfo, windowSize)
  );
  return (
    <div class="modal-content">
      <ModalHeader imageInfo={props.imageInfo} onClose={props.onClose} />
      <ModelBody
        imageInfo={props.imageInfo}
        captions={props.captions}
        layout={getLayout()}
      />
    </div>
  );
};

const ModelBody = (props: {
  captions: Captions;
  imageInfo: ImageInfoType;
  layout: LayoutInfo;
}) => {
  let refImageInfo!: HTMLDivElement;
  const [focused, setFocused] = createSignal(false);
  const [focusedType, setFocusedType] = createSignal<string | null>(null);
  const [getStyle, setStyle] = createSignal<JSX.CSSProperties>();

  // Update the style of the image info based on the layout and focus
  createEffect(
    on([() => props.imageInfo.name, focused], ([name, focused], prev_input) => {
      if (!focused || name !== prev_input?.[0]) {
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
      <ImageView
        imageInfo={props.imageInfo}
        onClick={() => setFocused((f) => !f)}
      />
      <div
        class="image-info"
        ref={refImageInfo}
        style={getStyle()}
        onClick={() => setFocused(true)}
        onFocusIn={() => setFocused(true)}
        onFocusOut={() => setFocused(false)}
      >
        <ImageInfo imageInfo={props.imageInfo} />
        <div class="caption-editor">
          <Index each={props.captions}>
            {(caption, idx) => (
              <CaptionInput
                tabindex={idx + 1}
                caption={caption()}
                onFocus={() => setFocusedType(caption()[0])}
                onBlur={() => setFocusedType(null)}
                state={
                  focusedType() === null
                    ? null
                    : focusedType() === caption()[0]
                    ? "expanded"
                    : "collapsed"
                }
              />
            )}
          </Index>
        </div>
      </div>
    </div>
  );
};

const ModalHeader = (props: {
  imageInfo: ImageInfoType;
  onClose: () => void;
}) => {
  const gallery = useGallery();
  const settings = useSettings();
  const deleteImageAction = useAction(gallery.deleteImage);
  const [isHolding, setIsHolding] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  let deleteTimeout: number;
  let progressInterval: number;

  const deleteImage = async () => {
    const data = gallery.data();
    if (!data) return;

    const currentIndex = data.items.findIndex(
      (item) => item.type === "image" && item.file_name === props.imageInfo.name
    );

    if (currentIndex !== -1) {
      await deleteImageAction(currentIndex);
      gallery.clearImageCache();
      props.onClose();
    }
  };

  const startDelete = () => {
    if (settings.instantDelete()) {
      deleteImage();
      return;
    }

    setIsHolding(true);
    setProgress(0);

    progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / 1300) * 16, 100));
    }, 16);

    deleteTimeout = setTimeout(deleteImage, 1300);
  };

  const cancelDelete = () => {
    setIsHolding(false);
    setProgress(0);
    clearTimeout(deleteTimeout);
    clearInterval(progressInterval);
  };

  return (
    <div class="modal-header">
      <h2>{props.imageInfo.name}</h2>
      <div class="modal-actions">
        <button
          class="icon"
          onClick={() => {
            window.location.href = props.imageInfo.download_path;
          }}
          aria-label="Download image"
          title="Download image"
          innerHTML={DownloadIcon}
        />
        <button
          class="icon delete-button"
          classList={{ holding: isHolding() }}
          style={{ "--progress": `${progress()}%` }}
          onMouseDown={startDelete}
          onMouseUp={cancelDelete}
          onMouseLeave={cancelDelete}
          onTouchStart={startDelete}
          onTouchEnd={cancelDelete}
          onTouchCancel={cancelDelete}
          aria-label="Hold to delete image"
          title="Hold to delete image"
          innerHTML={DeleteIcon}
        />
        <button
          class="icon"
          onClick={props.onClose}
          aria-label="Close image viewer"
          title="Close image viewer"
          innerHTML={DismissIcon}
        />
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

function computeLayout(image: Size, windowSize: Readonly<Size>): LayoutInfo {
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

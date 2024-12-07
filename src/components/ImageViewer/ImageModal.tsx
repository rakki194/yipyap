// src/components/ImageViewer/ImageModal.tsx
import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  JSX,
  onCleanup,
  Component,
} from "solid-js";
import { ImageView } from "./ImageView";
import { ImageInfo } from "./ImageInfo";
import { CaptionInput } from "./CaptionInput";
import "./styles.css";
import { useGallery } from "~/contexts/GalleryContext";
import getIcon from "~/icons";
import { useAction } from "@solidjs/router";
import type { ImageInfo as ImageInfoType, Captions } from "~/types";
import { useAppContext } from "~/contexts/app";

interface ImageModalProps {
  imageInfo: ImageInfoType;
  captions: Captions;
  onClose: () => void;
}

const GenerateTagsDropdown: Component<{ imageInfo: ImageInfoType }> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const gallery = useGallery();
  const generateTags = useAction(gallery.generateTags);

  return (
    <div class="generate-tags-dropdown">
      <button
        type="button"
        class="generate-tags-button card"
        onClick={() => setIsExpanded(x => !x)}
      >
        <span class="icon">{getIcon("sparkle")}</span>
        Generate Tags
        <span class="icon dropdown-icon" classList={{ expanded: isExpanded() }}>
          {getIcon("chevronDown")}
        </span>
      </button>
      
      <div class="dropdown-content" classList={{ expanded: isExpanded() }}>
        <button
          type="button"
          class="generate-tags-button card"
          onClick={() => {
            generateTags("jtp2");
            setIsExpanded(false);
          }}
        >
          <span class="icon">{getIcon("sparkle")}</span>
          Generate with JTP2
        </button>
        <button
          type="button"
          class="generate-tags-button card"
          onClick={() => {
            generateTags("wdv3");
            setIsExpanded(false);
          }}
        >
          <span class="icon">{getIcon("sparkle")}</span>
          Generate with WDv3
        </button>
      </div>
    </div>
  );
};

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
  const gallery = useGallery();
  let refImageInfo!: HTMLDivElement;
  const [focused, setFocused] = createSignal(false);
  const [focusedType, setFocusedType] = createSignal<string | null>(null);
  const [getStyle, setStyle] = createSignal<JSX.CSSProperties>();
  const generateTags = useAction(gallery.generateTags);

  // Add these variables for tracking shift key presses
  let lastShiftPress = 0;
  const DOUBLE_TAP_THRESHOLD = 300; // milliseconds

  // Add keyboard event handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Shift") {
      const now = Date.now();
      if (now - lastShiftPress < DOUBLE_TAP_THRESHOLD) {
        // Double tap detected - cycle to next caption
        const currentCaptions = props.captions;
        if (currentCaptions.length > 0) {
          const currentIndex = currentCaptions.findIndex(
            ([type]) => type === focusedType()
          );
          const nextIndex =
            currentIndex === -1 || currentIndex === currentCaptions.length - 1
              ? 0
              : currentIndex + 1;
          setFocused(true);
          setFocusedType(currentCaptions[nextIndex][0]);
        }
        lastShiftPress = 0; // Reset to prevent triple-tap
      } else {
        lastShiftPress = now;
      }
    }
  };

  // Add and remove event listener
  createEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  // Update the style of the image info based on the layout and focus
  createEffect((prev_path) => {
    const path = props.imageInfo.download_path;
    const layout = props.layout;
    if (!focused() || path !== prev_path) {
      setStyle(undefined);
      return path;
    }

    if (layout.layout === "horizontal") {
      const offset = layout.free_width - refImageInfo.offsetWidth;
      if (offset >= 0) {
        setStyle(undefined);
      } else {
        setStyle({
          transform: `translateX(${offset}px)`,
        });
      }
    } else {
      const offset = -refImageInfo.offsetWidth;
      setStyle({
        transform: `translateX(${offset}px)`,
      });
    }

    return path;
  });

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
        onClick={(e) => {
          setFocused(true);
        }}
      >
        <ImageInfo imageInfo={props.imageInfo} />
        <div class="caption-actions">
          <GenerateTagsDropdown imageInfo={props.imageInfo} />
        </div>
        <div
          class="caption-editor"
          onClick={(e) => {
            if (e.currentTarget === e.target) setFocusedType(null);
          }}
        >
          <Index each={props.captions}>
            {(caption, idx) => (
              <CaptionInput
                caption={caption()}
                onClick={() => setFocusedType(caption()[0])}
                state={
                  focusedType() === null || !focused()
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
  const app = useAppContext();
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
    if (app.instantDelete) {
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
          type="button"
          class="icon"
          onClick={() => {
            window.location.href = props.imageInfo.download_path;
          }}
          aria-label="Download image"
          title="Download image"
        >
          {getIcon("download")}
        </button>
        <button
          type="button"
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
        >
          {getIcon("delete")}
        </button>
        <button
          type="button"
          class="icon"
          onClick={props.onClose}
          aria-label="Close image viewer"
          title="Close image viewer"
        >
          {getIcon("dismiss")}
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
  const layout = width_scale > height_scale ? "horizontal" : "vertical";
  const scale = layout === "vertical" ? width_scale : height_scale;
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const free_width = viewWidth - width;
  const free_height = viewHeight - height;

  const res = {
    width,
    viewWidth,
    height,
    viewHeight,
    scale,
    layout: layout as LayoutStr,
    free_width,
    free_height,
  };
  return res;
}

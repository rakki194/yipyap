// src/components/ImageViewer/ImageModal.tsx
import {
  createEffect,
  createMemo,
  createSignal,
  Index,
  JSX,
  onCleanup,
  Component,
  Show,
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

export const ImageModal = (props: ImageModalProps) => {
  const { windowSize } = useGallery();
  const getLayout = createMemo(() =>
    computeLayout(props.imageInfo, windowSize)
  );
  const [showMetadata, setShowMetadata] = createSignal(false);

  // Add state for metadata bubble visibility
  const [isMetadataOpen, setIsMetadataOpen] = createSignal(false);

  return (
    <div class="modal-content">
      <ModalHeader 
        imageInfo={props.imageInfo} 
        onClose={props.onClose} 
        onToggleMetadata={() => setIsMetadataOpen(prev => !prev)} // Update toggle handler
      />
      <ModelBody
        imageInfo={props.imageInfo}
        captions={props.captions}
        layout={getLayout()}
      >
        <Show when={showMetadata()}>
          <ImageInfo imageInfo={props.imageInfo} />
        </Show>
      </ModelBody>
    </div>
  );
};

const ModelBody = (props: {
  captions: Captions;
  imageInfo: ImageInfoType;
  layout: LayoutInfo;
  children?: JSX.Element;
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
        <div class="caption-editor"
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
        {props.children}
      </div>
    </div>
  );
};

const ModalHeader = (props: {
  imageInfo: ImageInfoType;
  onClose: () => void;
  onToggleMetadata: () => void;
}) => {
  const gallery = useGallery();
  const app = useAppContext();
  const deleteImageAction = useAction(gallery.deleteImage);
  const generateTags = useAction(gallery.generateTags);
  const [isHolding, setIsHolding] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  const [isExpanded, setIsExpanded] = createSignal(false);
  let deleteTimeout: number;
  let progressInterval: number;

  // Add state for metadata bubble visibility
  const [isMetadataOpen, setIsMetadataOpen] = createSignal(false);

  // Reference to the metadata bubble for click detection
  let metadataBubbleRef: HTMLDivElement | undefined;
  let metadataButtonRef: HTMLButtonElement | undefined;

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

  // Handle clicks outside the metadata bubble to close it
  createEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        metadataBubbleRef &&
        !metadataBubbleRef.contains(target) &&
        metadataButtonRef &&
        !metadataButtonRef.contains(target)
      ) {
        setIsMetadataOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMetadataOpen()) {
        setIsMetadataOpen(false);
      }
    };

    if (isMetadataOpen()) {
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
      onCleanup(() => {
        window.removeEventListener('click', handleClickOutside);
        window.removeEventListener('keydown', handleKeyDown);
      });
    }
  });

  return (
    <div class="modal-header">
      <h2>{props.imageInfo.name}</h2>
      <div class="modal-actions">
        <button
          type="button"
          class="icon metadata-button"
          onClick={() => setIsMetadataOpen(prev => !prev)}
          ref={metadataButtonRef}
          title="Show Metadata"
          aria-label="Show Metadata"
        >
          {getIcon("info")}
        </button>
        <Show when={isMetadataOpen()}>
          <div 
            class="metadata-bubble" 
            ref={metadataBubbleRef}
          >
            <ImageInfo imageInfo={props.imageInfo} />
          </div>
        </Show>
        <button
          type="button"
          class="icon"
          onClick={() => setIsExpanded((x: boolean) => !x)}
          title="Generate Tags"
          aria-label="Generate Tags"
        >
          {getIcon("sparkle")}
        </button>
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
        <Show when={isExpanded()}>
          <div class="generate-tags-dropdown card">
            <button
              type="button"
              onClick={() => {
                generateTags("jtp2");
                setIsExpanded(false);
              }}
            >
              Generate with JTP2
            </button>
            <button
              type="button"
              onClick={() => {
                generateTags("wdv3");
                setIsExpanded(false);
              }}
            >
              Generate with WDv3
            </button>
          </div>
        </Show>
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

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
  For,
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
import { captionIconsMap } from "~/icons";

interface ImageModalProps {
  imageInfo: ImageInfoType;
  captions: Captions;
  onClose: () => void;
}

// Add this near the top of the file, outside any components
const NO_CAPTION_IMAGES = [
  '/assets/nocap/cactus-4x.png',
  '/assets/nocap/chimken-20x.png'
] as const;

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

  const saveCaption = useAction(gallery.saveCaption);

  const handleCreateCaption = (type: string) => {
    saveCaption({
      type,
      caption: "",
    });
    setFocused(true);
    setFocusedType(type);
  };

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
          <Show
            when={props.captions.length > 0}
            fallback={
              <EmptyCaptionState onCreateCaption={handleCreateCaption} />
            }
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
          </Show>
        </div>
        {props.children}
      </div>
    </div>
  );
};

const ModalHeader = (props: {
  imageInfo: ImageInfoType;
  onClose: () => void;
}) => {
  const gallery = useGallery();
  const generateTags = useAction(gallery.generateTags);

  // Reference to the metadata bubble for click detection
  let metadataButtonRef: HTMLButtonElement | undefined;


  return (
    <div class="modal-header">
      <h2>{props.imageInfo.name}</h2>
      <div class="modal-actions">
        <button
          type="button"
          class="icon metadata-button"
          ref={metadataButtonRef}
          title="Show Metadata"
          aria-label="Show Metadata"
        >
          {getIcon("info")}
        </button>
        <ExpandableMenu generateTags={generateTags} />
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
        <DeleteButton
          imageInfo={props.imageInfo}
        />
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

// New DeleteButton component
const DeleteButton = (props: {
  imageInfo: ImageInfoType;
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

    if (gallery.selectedImage !== null) {
      await deleteImageAction(gallery.selected!);
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
  );
};

// Updated ExpandableMenu component
const ExpandableMenu = (props: {
  generateTags: (type: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  return (
    <>
      <button
        type="button"
        class="icon"
        onClick={() => setIsExpanded(x => !x)}
        title="Generate Tags"
        aria-label="Generate Tags"
      >
        {getIcon("sparkle")}
      </button>
      <Show when={isExpanded()}>
        <div class="generate-tags-dropdown card">
          <button
            type="button"
            onClick={() => {
              props.generateTags("jtp2");
              setIsExpanded(false);
            }}
          >
            Generate with JTP2
          </button>
          <button
            type="button"
            onClick={() => {
              props.generateTags("wdv3");
              setIsExpanded(false);
            }}
          >
            Generate with WDv3
          </button>
        </div>
      </Show>
    </>
  );
};

// Update the EmptyCaptionState component
const EmptyCaptionState = (props: {
  onCreateCaption: (type: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const { t } = useAppContext();
  
  // Create a memo for the randomly selected image
  const randomImage = createMemo(() => {
    const randomIndex = Math.floor(Math.random() * NO_CAPTION_IMAGES.length);
    return NO_CAPTION_IMAGES[randomIndex];
  });

  return (
    <div class="empty-captions-state">
      <div 
        class="empty-state-image"
        role="img"
        aria-label="No captions"
        style={{
          "background-image": `url(${randomImage()})`
        }}
      />
      <p class="empty-state-message">{t('gallery.noCaptionFiles')}</p>
      <div class="caption-creation">
        <button
          type="button"
          class="primary-button"
          onClick={() => setIsExpanded(x => !x)}
        >
          {t('gallery.createCaption')}
        </button>
        <Show when={isExpanded()}>
          <div class="caption-type-dropdown card">
            <For each={Object.entries(captionIconsMap)}>
              {([type, icon]) => (
                <button
                  type="button"
                  class="caption-type-option"
                  onClick={() => {
                    props.onCreateCaption(type);
                    setIsExpanded(false);
                  }}
                >
                  <span class="icon">{getIcon(icon)}</span>
                  {t(`gallery.captionTypes.${type}`)}
                </button>
              )}
            </For>
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

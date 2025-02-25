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
  onMount,
} from "solid-js";
import { ImageView } from "./ImageView";
import { ImageInfo } from "./ImageInfo";
import { CaptionInput } from "./CaptionInput";
import "./styles.css";
import { useGallery } from "~/contexts/GalleryContext";
import getIcon from "~/icons";
import { useAction } from "@solidjs/router";
import type { ImageInfo as ImageInfoType, Captions, SaveCaption } from "~/types";
import { useAppContext } from "~/contexts/app";
import { captionIconsMap } from "~/icons";
import { useGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import { useDoubleTap } from "~/composables/useDoubleTap";

interface ImageModalProps {
  imageInfo: ImageInfoType;
  captions: Captions;
  onClose: () => void;
  generateTags: (model: string) => Promise<any>;
  saveCaption: (caption: SaveCaption) => Promise<any>;
  deleteCaption: (type: string) => Promise<any>;
  deleteImageAction: (idx: number) => Promise<any>;
}

const NO_CAPTION_IMAGES = [
  '/pixelings/cactus.png',
  '/pixelings/chimken.png',
  '/pixelings/fonx.png',
] as const;

// Add this helper function near the top of the file
const AVAILABLE_CAPTION_TYPES = ['txt', 'tags', 'caption', 'wd'] as const;

export const ImageModal = (props: ImageModalProps) => {
  const { windowSize } = useGallery();
  const gallery = useGallery();
  const getLayout = createMemo(() =>
    computeLayout(props.imageInfo, windowSize)
  );
  const [showMetadata, setShowMetadata] = createSignal(false);
  const escape = useGlobalEscapeManager();

  // Add keyboard navigation handler
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only prevent default if we're in a text input or textarea
    const isInInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

    if (isInInput) {
      // Prevent default scrolling behavior only when in input fields
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' ||
        e.key === 'PageDown' || e.key === 'PageUp' ||
        e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
      }
    } else {
      // Handle navigation when not in input fields
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        gallery.selection.selectNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        gallery.selection.selectPrev();
      }
    }
  };

  onMount(() => {
    // Register escape handler
    escape.setOverlayState("modal", true);
    const unregister = escape.registerHandler("modal", props.onClose);

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    // Add modal-open class to body
    document.body.classList.add('modal-open');

    onCleanup(() => {
      escape.setOverlayState("modal", false);
      unregister();
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      // Remove modal-open class from body
      document.body.classList.remove('modal-open');
    });
  });

  return (
    <div
      class="modal-overlay"
      onClick={props.onClose}
    >
      <div
        class="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          imageInfo={props.imageInfo}
          onClose={props.onClose}
          showMetadata={showMetadata()}
          setShowMetadata={setShowMetadata}
        />
        <ModelBody
          imageInfo={props.imageInfo}
          captions={props.captions}
          layout={getLayout()}
        />
        <Show when={showMetadata()}>
          <div class="metadata-panel">
            <ImageInfo imageInfo={props.imageInfo} />
          </div>
        </Show>
      </div>
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
  const { t, alwaysShowCaptionEditor } = useAppContext();
  let refImageInfo!: HTMLDivElement;
  const [focused, setFocused] = createSignal(alwaysShowCaptionEditor);
  const [focusedType, setFocusedType] = createSignal<string | null>(null);
  const [getStyle, setStyle] = createSignal<JSX.CSSProperties>();
  const [isExpanded, setIsExpanded] = createSignal(false);

  const handleDoubleTap = () => {
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
  };

  useDoubleTap({
    onDoubleTap: handleDoubleTap,
    passive: true
  });

  // Keep focused state in sync with alwaysShowCaptionEditor setting
  createEffect(() => {
    if (alwaysShowCaptionEditor) {
      setFocused(true);
    }
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

  const handleCreateCaption = async (type: string) => {
    try {
      // Set focus immediately
      setFocused(true);
      setFocusedType(type);

      const result = await saveCaption({
        type,
        caption: ""
      });

      if (result instanceof Error) {
        throw result;
      }
    } catch (error) {
      console.error("Error creating caption:", error);
      // On error, revert focus state
      setFocused(false);
      setFocusedType(null);
    }
  };

  // Add this function to check for missing caption types
  const hasMissingCaptionTypes = () => {
    const existingTypes = new Set(props.captions.map(([type]) => type));
    return AVAILABLE_CAPTION_TYPES.some(type => !existingTypes.has(type));
  };

  return (
    <div class="modal-body" classList={{ [props.layout.layout]: true }}>
      <ImageView
        imageInfo={props.imageInfo}
        onClick={() => !alwaysShowCaptionEditor && setFocused((f) => !f)}
      />
      <div
        class="image-info"
        classList={{ focused: focused() }}
        ref={refImageInfo}
        style={getStyle()}
        onClick={(e) => {
          if (!alwaysShowCaptionEditor) {
            setFocused(true);
          }
        }}
      >
        <div class="caption-editor"
          onClick={(e) => {
            if (e.currentTarget === e.target && !alwaysShowCaptionEditor) {
              setFocusedType(null);
            }
          }}
        >
          <Show
            when={props.captions.length > 0}
            fallback={
              <EmptyCaptionState onCreateCaption={handleCreateCaption} />
            }
          >
            <>
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
              <Show when={hasMissingCaptionTypes()}>
                <div class="caption-creation">
                  <button
                    type="button"
                    onClick={() => setIsExpanded((x: boolean) => !x)}
                  >
                    <span class="icon">{getIcon("plus")}</span>
                    {t('gallery.createCaption')}
                  </button>
                  <Show when={isExpanded()}>
                    <div class="caption-type-dropdown card">
                      <For each={Object.entries(captionIconsMap)}>
                        {([type, icon]) => (
                          <Show when={!props.captions.some(([t]) => t === type)}>
                            <button
                              type="button"
                              class="caption-type-option"
                              onClick={() => handleCreateCaption(type)}
                            >
                              <span class="icon">{getIcon(icon)}</span>
                              {t(`gallery.captionTypes.${type}`)}
                            </button>
                          </Show>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              </Show>
            </>
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
  showMetadata: boolean;
  setShowMetadata: (show: boolean) => void;
}) => {
  const gallery = useGallery();
  const generateTags = useAction(gallery.generateTags);
  const setFavoriteState = useAction(gallery.setFavoriteState);
  const { t } = useAppContext();

  return (
    <div class="modal-header">
      <h2>{props.imageInfo.name}</h2>
      <div class="modal-actions">
        <FavoriteButton imageInfo={props.imageInfo} setFavoriteState={setFavoriteState} />
        <button
          type="button"
          class="icon metadata-button"
          classList={{ active: props.showMetadata }}
          onClick={() => props.setShowMetadata(!props.showMetadata)}
          title={t('imageViewer.showMetadata')}
          aria-label={t('imageViewer.showMetadata')}
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
          onClose={props.onClose}
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

const FavoriteButton = (props: {
  imageInfo: ImageInfoType;
  setFavoriteState: (image: ImageInfoType, state: number) => void;
}) => {
  const [favoriteState, setFavoriteState] = createSignal(props.imageInfo.favorite_state ?? 0);

  const getStarIcon = (state: number | undefined) => {
    const flooredState = Math.floor(state ?? 0);
    console.debug('getStarIcon input:', { original: state, floored: flooredState });
    switch (flooredState) {
      case 0: return "star";
      case 1: return "starOneQuarter";
      case 2: return "starHalf";
      case 3: return "starThreeQuarter";
      case 4: return "starFilled";
      case 5: return "starEmphasisFilled";
      case 6: return "starOff";
      default: return "star";
    }
  };

  const getNextState = (currentState: number | undefined) => {
    const current = currentState ?? 0;
    const nextState = Math.floor((current + 1) % 7);
    console.debug('getNextState:', {
      currentState: current,
      currentStateType: typeof current,
      nextState,
      nextStateType: typeof nextState
    });
    return nextState;
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    const currentState = favoriteState();
    console.debug('Current favorite_state:', {
      value: currentState,
      type: typeof currentState,
      original: props.imageInfo.favorite_state
    });
    const nextState = getNextState(currentState);
    console.debug('Setting favorite state:', {
      image: props.imageInfo.name,
      nextState,
      nextStateType: typeof nextState
    });
    setFavoriteState(nextState);
    props.setFavoriteState(props.imageInfo, nextState);
  };

  // Create an effect to update the local state when the prop changes
  createEffect(() => {
    setFavoriteState(props.imageInfo.favorite_state ?? 0);
  });

  return (
    <button
      type="button"
      class="icon favorite-button"
      classList={{
        'favorite-emphasis': Math.floor(favoriteState()) === 5,
        'favorite-off': Math.floor(favoriteState()) === 6
      }}
      onClick={handleClick}
      aria-label="Toggle favorite"
      title="Toggle favorite"
    >
      {getIcon(getStarIcon(favoriteState()))}
    </button>
  );
};

// Update DeleteButton component
const DeleteButton = (props: {
  imageInfo: ImageInfoType;
  onClose: () => void;
}) => {
  const gallery = useGallery();
  const app = useAppContext();
  const deleteImageAction = useAction(gallery.deleteImage);
  const [isHolding, setIsHolding] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  let deleteTimeout: ReturnType<typeof setTimeout>;
  let progressInterval: ReturnType<typeof setInterval>;

  const hasMultiSelection = () => {
    return gallery.selection.multiSelected.size > 0 || gallery.selection.multiFolderSelected.size > 0;
  };

  const getSelectedCount = () => {
    return gallery.selection.multiSelected.size + gallery.selection.multiFolderSelected.size;
  };

  const deleteImage = async () => {
    const data = gallery.data();
    if (!data) return;

    if (hasMultiSelection()) {
      // Handle multi-delete
      const message = app.t('gallery.confirmMultiDelete', { count: getSelectedCount() });
      if (confirm(message)) {
        // Handle folder deletions first if any folders are selected
        const selectedFolders = Array.from(gallery.selection.multiFolderSelected);
        if (selectedFolders.length > 0) {
          const folderMessage = app.t('gallery.confirmFolderDelete', { count: selectedFolders.length });
          if (confirm(folderMessage)) {
            const folderResults = await Promise.allSettled(
              selectedFolders.map(async (idx) => {
                const item = data.items[idx];
                if (item?.type !== 'directory') return;

                const folderPath = data.path
                  ? `${data.path}/${item.file_name}`
                  : item.file_name;

                const params = new URLSearchParams();
                params.append("confirm", "true");

                return await fetch(`/api/browse/${folderPath}?${params.toString()}`, {
                  method: 'DELETE',
                });
              })
            );

            const failedFolders = folderResults.filter(r => r.status === 'rejected').length;
            if (failedFolders > 0) {
              alert(app.t('gallery.folderDeleteError'));
            }
          }
        }

        // Handle image deletions
        const selectedImages = Array.from(gallery.selection.multiSelected);
        if (selectedImages.length > 0) {
          const results = await Promise.allSettled(
            selectedImages.map(async (idx) => {
              try {
                const item = data.items[idx];
                if (item?.type !== 'image') return;

                const imagePath = data.path
                  ? `${data.path}/${item.file_name}`
                  : item.file_name;

                const params = new URLSearchParams();
                params.append("confirm", "true");

                if (app.preserveLatents) {
                  params.append("preserve_latents", "true");
                }
                if (app.preserveTxt) {
                  params.append("preserve_txt", "true");
                }

                const response = await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
                  method: "DELETE",
                });

                if (response.ok) {
                  app.notify(app.t('notifications.deleteSuccess'), 'success');
                  props.onClose();
                  // Refresh gallery data
                  gallery.refetchGallery();
                } else {
                  console.error(`Error deleting image at index ${idx}:`, response);
                  throw new Error('Failed to delete image');
                }
              } catch (error) {
                console.error(`Error deleting image at index ${idx}:`, error);
                throw error;
              }
            })
          );

          const failedCount = results.filter(r => r.status === 'rejected').length;
          if (failedCount > 0) {
            alert(app.t('gallery.fileDeleteError'));
          }
        }

        // Clear selection after all operations
        gallery.selection.clearMultiSelect();
        gallery.selection.clearFolderMultiSelect();

        // Force a refetch
        gallery.invalidate();
        await gallery.refetch();
      }
    } else if (gallery.selectedImage !== null) {
      // Handle single image delete
      const selectedItem = data.items[gallery.selected!];
      if (selectedItem?.type === 'image') {
        await deleteImageAction(gallery.selected!);
      }
    }
  };

  const startDelete = () => {
    if (app.instantDelete || hasMultiSelection()) {
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
      aria-label={hasMultiSelection()
        ? app.t('gallery.deleteSelected', { count: getSelectedCount() })
        : "Hold to delete image"
      }
      title={hasMultiSelection()
        ? app.t('gallery.deleteSelected', { count: getSelectedCount() })
        : "Hold to delete image"
      }
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
      <CaptionCreationButton onCreateCaption={props.onCreateCaption} />
    </div>
  );
}

// Create a new component for the caption creation button
const CaptionCreationButton = (props: {
  onCreateCaption: (type: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const { t } = useAppContext();

  const handleCreateCaption = async (type: string) => {
    try {
      await props.onCreateCaption(type);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error creating caption:", error);
    }
  };

  return (
    <div class="caption-creation">
      <button
        type="button"
        class="primary-button"
        onClick={() => setIsExpanded(x => !x)}
      >
        <span class="icon">{getIcon("plus")}</span>
        {t('gallery.createCaption')}
      </button>
      <Show when={isExpanded()}>
        <div class="caption-type-dropdown card">
          <For each={Object.entries(captionIconsMap)}>
            {([type, icon]) => (
              <button
                type="button"
                class="caption-type-option"
                onClick={() => handleCreateCaption(type)}
              >
                <span class="icon">{getIcon(icon)}</span>
                {t(`gallery.captionTypes.${type}`)}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

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

export { EmptyCaptionState, DeleteButton };

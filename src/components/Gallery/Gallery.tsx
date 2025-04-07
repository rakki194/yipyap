// src/components/Gallery/Gallery.tsx
import { Component, Show, onMount } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { QuickJump } from "./QuickJump";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { UploadOverlay } from '../UploadOverlay/UploadOverlay';
import { ProgressOverlay } from './ProgressOverlay';
import { SettingsOverlay } from './SettingsOverlay';
import { useKeyboardManager } from './KeyboardManager';
import { useDragAndDrop } from '../../composables/useDragAndDrop';
import { useGalleryScroll } from '../../composables/useGalleryScroll';
import { useGalleryUI } from '../../composables/useGalleryUI';
import { useGalleryEffects } from '../../composables/useGalleryEffects';
import getIcon from "~/icons";
import "./Gallery.css";
import { NewFolderDialog } from "./NewFolderDialog";
import { logger } from '~/utils/logger';

export const Gallery: Component = () => {
  const gallery = useGallery();
  const appContext = useAppContext();

  // Initialize hooks
  const {
    scrollToSelected,
    smoothScroll,
    startPositionChecking,
    autoScrolling,
    setupWheelHandler
  } = useGalleryScroll();

  const {
    showQuickJump,
    setShowQuickJump,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isDragging,
    setIsDragging,
    showSettings,
    setShowSettings,
    showNewFolderDialog,
    setShowNewFolderDialog,
    progressInfo,
    openSettings,
    openNewFolder
  } = useGalleryUI();

  const handleDeleteConfirm = async () => {
    const data = gallery.data();
    if (!data) return;

    const t = appContext.t;

    // Handle image deletions
    const selectedImages = Array.from(gallery.selection.multiSelected);
    let failedImages = 0;
    if (selectedImages.length > 0) {
      for (const imageIdx of selectedImages) {
        try {
          await gallery.deleteImage(imageIdx);
        } catch (error) {
          failedImages++;
          logger.error('Failed to delete image at index:', imageIdx, error);
        }
      }
      if (failedImages > 0) {
        appContext.notify(
          t('gallery.deleteImagesFailed', { count: failedImages }),
          'error'
        );
      }
    }

    // Clear selection after all operations
    gallery.selection.clearMultiSelect();
    gallery.selection.clearFolderMultiSelect();

    // Force a refetch
    gallery.refetchGallery();

    setShowDeleteConfirm(false);
  };

  // Initialize keyboard manager with handleDeleteConfirm
  useKeyboardManager({
    onShowQuickJump: () => setShowQuickJump(true),
    onShowSettings: () => setShowSettings(true),
    onShowDeleteConfirm: () => setShowDeleteConfirm(true),
    onShowNewFolderDialog: () => setShowNewFolderDialog(true),
    onDeleteConfirm: handleDeleteConfirm,
    scrollToSelected,
    smoothScroll,
    isSettingsOpen: showSettings(),
    isQuickJumpOpen: showQuickJump()
  });

  // Initialize drag and drop
  useDragAndDrop({
    onDragStateChange: setIsDragging
  });

  // Initialize effects
  useGalleryEffects({
    scrollToSelected,
    autoScrolling,
    startPositionChecking
  });

  // Initialize wheel handler
  onMount(() => {
    setupWheelHandler();
  });

  const handleFileUpload = (files: FileList) => {
    setShowQuickJump(false);
    const input = document.getElementById('file-upload-input') as HTMLInputElement;
    if (input) {
      const dataTransfer = new DataTransfer();
      for (const file of files) {
        dataTransfer.items.add(file);
      }
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // Store scroll position
  const handleModalClose = (e?: MouseEvent | KeyboardEvent | TouchEvent) => {
    if (e?.preventDefault) e.preventDefault();
    const galleryElement = document.getElementById('gallery');
    const scrollPos = galleryElement?.scrollTop || 0;
    gallery.setMode("view");
    // Restore scroll position after a short delay
    requestAnimationFrame(() => {
      if (galleryElement) {
        galleryElement.scrollTop = scrollPos;
      }
    });
  };

  return (
    <>
      <UploadOverlay isVisible={isDragging()} />
      <div
        id="gallery"
        class="gallery"
        classList={{
          'settings-open': showSettings()
        }}
      >
        <Show when={gallery.data()}>
          {(data) => {
            logger.debug('Gallery rendering with data:', {
              path: data().path,
              itemCount: data().items?.length,
              totalFolders: data().total_folders,
              totalImages: data().total_images
            });
            return (
              <ImageGrid
                data={data()}
                items={data().items}
                path={data().path}
                onImageClick={(e, ...args) => {
                  // Prevent scroll restoration
                  if (e?.preventDefault) e.preventDefault();
                  gallery.edit(...args);
                }}
              />
            );
          }}
        </Show>

        <Show when={gallery.data.error}>
          <div class="gallery-error">
            <span class="icon error-icon">{getIcon("error")}</span>
            <span class="error-message">
              {gallery.data.error instanceof Error
                ? gallery.data.error.message
                : appContext.t("gallery.pathNotFound")}
            </span>
          </div>
        </Show>

        <Show when={progressInfo()}>
          {(progress) => (
            <ProgressOverlay progress={progress()} />
          )}
        </Show>
      </div>

      <Show when={gallery.getEditedImage()}>
        <ImageModal
          imageInfo={gallery.getEditedImage()!}
          captions={gallery.getEditedImage()!.captions}
          onClose={handleModalClose}
          generateTags={gallery.generateTags}
          saveCaption={gallery.saveCaption}
          deleteCaption={gallery.deleteCaption}
          deleteImageAction={gallery.deleteImage}
        />
      </Show>

      <Show when={showQuickJump()}>
        <QuickJump
          onClose={() => setShowQuickJump(false)}
          onShowSettings={openSettings}
          onShowNewFolder={openNewFolder}
          onUploadFiles={handleFileUpload}
          onDeleteCurrentFolder={() => {
            setShowQuickJump(false);
            setShowDeleteConfirm(true);
          }}
        />
      </Show>

      <Show when={showDeleteConfirm()}>
        <DeleteConfirmDialog
          imageCount={gallery.selection.multiSelected.size}
          folderCount={gallery.selection.multiFolderSelected.size}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </Show>

      <Show when={showSettings()}>
        <SettingsOverlay
          onClose={() => setShowSettings(false)}
        />
      </Show>

      <Show when={showNewFolderDialog()}>
        <NewFolderDialog
          onClose={() => setShowNewFolderDialog(false)}
        />
      </Show>
    </>
  );
};

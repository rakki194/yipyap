// src/components/Gallery/Gallery.tsx
import {
  Component,
  createSignal,
  Show,
  createEffect,
  onCleanup,
} from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { QuickJump } from "./QuickJump";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { UploadOverlay } from '../UploadOverlay/UploadOverlay';
import { ProgressOverlay, ProgressInfo } from './ProgressOverlay';
import { SettingsOverlay } from './SettingsOverlay';
import { useScrollManager } from './ScrollManager';
import { useKeyboardManager } from './KeyboardManager';
import { useDragAndDrop } from '../DragAndDrop';
import "./Gallery.css";

export const Gallery: Component = () => {
  const gallery = useGallery();
  const appContext = useAppContext();
  const [showQuickJump, setShowQuickJump] = createSignal(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = createSignal(false);
  const [progressInfo, setProgressInfo] = createSignal<ProgressInfo | null>(null);
  const [isWheelScrolling, setWheelScrolling] = createSignal(false);
  const [autoScrolling, setAutoScrolling] = createSignal(false);
  const [checkingPosition, setCheckingPosition] = createSignal(false);
  let positionCheckInterval: number | null = null;

  // Initialize managers
  const scrollManager = useScrollManager(200);

  const smoothScroll = (targetY: number, forceScroll = false) => {
    scrollManager.smoothScrollTo(targetY, forceScroll);
  };

  const scrollToSelected = (forceScroll = false) => {
    const selectedIdx = gallery.selected;
    if (selectedIdx === null || (checkingPosition() && !forceScroll)) return;
    if (!forceScroll && scrollManager.isActive) return;

    const galleryElement = document.getElementById('gallery');
    const selectedElement = document.querySelector(`#gallery .responsive-grid .item:nth-child(${selectedIdx + 1})`);
    if (!galleryElement || !selectedElement) return;

    const galleryRect = galleryElement.getBoundingClientRect();
    const selectedRect = selectedElement.getBoundingClientRect();

    // Calculate visible area with margins
    const visibleTop = galleryRect.top + (galleryRect.height * 0.15);
    const visibleBottom = galleryRect.bottom - (galleryRect.height * 0.15);

    const needsScroll = forceScroll || 
      selectedRect.top < visibleTop || 
      selectedRect.bottom > visibleBottom ||
      selectedRect.top > visibleBottom || 
      selectedRect.bottom < visibleTop;

    if (needsScroll) {
      const targetY = galleryElement.scrollTop + 
        (selectedRect.top - galleryRect.top) - 
        (galleryRect.height / 2) + 
        (selectedRect.height / 2);

      setAutoScrolling(true);
      const initialSelectedIdx = selectedIdx;
      
      smoothScroll(targetY, true);

      setTimeout(() => {
        setAutoScrolling(false);
        
        // Verify selection and position after scroll
        if (gallery.selected === initialSelectedIdx) {
          const newSelectedElement = document.querySelector(
            `#gallery .responsive-grid .item:nth-child(${initialSelectedIdx + 1})`
          );
          if (newSelectedElement) {
            const newRect = newSelectedElement.getBoundingClientRect();
            const newGalleryRect = galleryElement.getBoundingClientRect();
            
            if (newRect.top < newGalleryRect.top || 
                newRect.bottom > newGalleryRect.bottom) {
              requestAnimationFrame(() => scrollToSelected(true));
            }
          }
        } else {
          requestAnimationFrame(() => scrollToSelected(true));
        }
      }, 200 + 50);
    }
  };

  // Initialize keyboard manager
  useKeyboardManager({
    onShowQuickJump: () => setShowQuickJump(true),
    onShowSettings: () => setShowSettings(true),
    onShowDeleteConfirm: () => setShowDeleteConfirm(true),
    onShowNewFolderDialog: () => setShowNewFolderDialog(true),
    scrollToSelected,
    smoothScroll,
    isSettingsOpen: showSettings(),
    isQuickJumpOpen: showQuickJump()
  });

  // Initialize drag and drop
  useDragAndDrop({
    onDragStateChange: setIsDragging
  });

  const startPositionChecking = () => {
    if (positionCheckInterval) return;
    
    positionCheckInterval = window.setInterval(() => {
      const selectedIdx = gallery.selected;
      if (selectedIdx === null || autoScrolling() || checkingPosition()) return;

      const galleryElement = document.getElementById('gallery');
      const selectedElement = document.querySelector(`#gallery .responsive-grid .item:nth-child(${selectedIdx + 1})`);
      if (!galleryElement || !selectedElement) return;

      const galleryRect = galleryElement.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();

      // Check if element is fully out of view
      const isOutOfView = 
        selectedRect.bottom < galleryRect.top || 
        selectedRect.top > galleryRect.bottom;

      if (isOutOfView) {
        setCheckingPosition(true);
        requestAnimationFrame(() => {
          scrollToSelected(true);
          setTimeout(() => setCheckingPosition(false), 200);
        });
      }
    }, 500); // Check every 500ms
  };

      onCleanup(() => {
      if (positionCheckInterval) {
        clearInterval(positionCheckInterval);
        positionCheckInterval = null;
      }
  });

  // Initialize position checking
  createEffect(() => {
    startPositionChecking();
  });

  createEffect(() => {
    const selected = gallery.selected;
    if (selected !== null && !autoScrolling()) {
      const frame = requestAnimationFrame(() => {
        scrollToSelected(true);
      });
      onCleanup(() => cancelAnimationFrame(frame));
    }
  });

  createEffect(() => {
    const currentData = gallery.data();
    if (currentData) {
      const path = currentData.path.split("/").filter(Boolean);
      const title = path.length > 0 
        ? `${path.join(" / ")} - ~yipyap` 
        : "Gallery - ~yipyap";
      document.title = title;
    }
  });

  createEffect(() => {
    const handleThumbnailSizeChange = () => {
      gallery.invalidate();
      gallery.refetch();
    };
    
    window.addEventListener('thumbnailSizeChanged', handleThumbnailSizeChange);
    onCleanup(() => {
      window.removeEventListener('thumbnailSizeChanged', handleThumbnailSizeChange);
    });
  });

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
          {(data) => (
            <ImageGrid
              data={data()}
              items={data().items}
              path={data().path}
              onImageClick={gallery.edit}
            />
          )}
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
          onClose={() => gallery.setMode("view")}
          generateTags={gallery.generateTags}
          saveCaption={gallery.saveCaption}
          deleteCaption={gallery.deleteCaption}
          deleteImageAction={gallery.deleteImage}
        />
      </Show>

      <Show when={showQuickJump()}>
        <QuickJump 
          onClose={() => setShowQuickJump(false)} 
          onShowSettings={() => {
            setShowQuickJump(false);
            setTimeout(() => setShowSettings(true), 0);
          }}
          onShowNewFolder={() => {
            setShowQuickJump(false);
            setTimeout(() => setShowNewFolderDialog(true), 0);
          }}
          onUploadFiles={(files) => {
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
          }}
          onDeleteCurrentFolder={() => {
            setShowQuickJump(false);
            setShowDeleteConfirm(true);
          }}
        />
      </Show>

      <Show when={showSettings()}>
        <SettingsOverlay onClose={() => setShowSettings(false)} />
      </Show>

      <Show when={showDeleteConfirm()}>
        <DeleteConfirmDialog
          imageCount={gallery.selection.multiSelected.size}
          folderCount={gallery.selection.multiFolderSelected.size}
          onConfirm={async () => {
            const data = gallery.data();
            if (!data) return;
            
            const t = appContext.t;
            
            // Handle folder deletions first
            const selectedFolders = Array.from(gallery.selection.multiFolderSelected);
            let failedFolders = 0;
            if (selectedFolders.length > 0) {
              setProgressInfo({
                current: 0,
                total: selectedFolders.length,
                type: 'delete',
                message: t("gallery.deletingFiles", { count: selectedFolders.length })
              });
              
              const folderResults = await Promise.allSettled(
                selectedFolders.map(async (idx, index) => {
                  const item = data.items[idx];
                  if (item?.type !== 'directory') return;
                  
                  const folderPath = data.path
                    ? `${data.path}/${item.file_name}`
                    : item.file_name;
                    
                  const params = new URLSearchParams();
                  params.append("confirm", "true");
                  
                  const result = await fetch(`/api/browse/${folderPath}?${params.toString()}`, {
                    method: 'DELETE',
                  });

                  setProgressInfo(prev => prev ? {
                    ...prev,
                    current: index + 1
                  } : null);

                  return result;
                })
              );

              failedFolders = folderResults.filter(r => r.status === 'rejected').length;
              if (failedFolders > 0) {
                appContext.notify(
                  t('gallery.folderDeleteError'),
                  "error",
                  "delete-operation"
                );
              }
            }

            // Handle image deletions
            const selectedImages = Array.from(gallery.selection.multiSelected);
            if (selectedImages.length > 0) {
              setProgressInfo({
                current: 0,
                total: selectedImages.length,
                type: 'delete',
                message: t("gallery.deletingFiles", { count: selectedImages.length })
              });
              
              const results = await Promise.allSettled(
                selectedImages.map(async (idx, index) => {
                  const item = data.items[idx];
                  if (item?.type !== 'image') return;
                  
                  const imagePath = data.path
                    ? `${data.path}/${item.file_name}`
                    : item.file_name;
                    
                  const params = new URLSearchParams();
                  params.append("confirm", "true");
                  
                  if (appContext.preserveLatents) {
                    params.append("preserve_latents", "true");
                  }
                  if (appContext.preserveTxt) {
                    params.append("preserve_txt", "true");
                  }

                  const result = await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
                    method: "DELETE",
                  });

                  setProgressInfo(prev => prev ? {
                    ...prev,
                    current: index + 1
                  } : null);

                  return result;
                })
              );

              const failedCount = results.filter(r => r.status === 'rejected').length;
              if (failedCount > 0) {
                appContext.notify(
                  t('gallery.fileDeleteError'),
                  "error",
                  "delete-operation"
                );
              } else {
                const totalDeleted = selectedImages.length + selectedFolders.length;
                appContext.notify(
                  t('gallery.deletedCount', { count: totalDeleted }),
                  "success",
                  "delete-operation"
                );
              }
            } else if (selectedFolders.length > 0 && !failedFolders) {
              // Show success for folder deletion if no images were deleted
              appContext.notify(
                t('gallery.deletedCount', { count: selectedFolders.length }),
                "success",
                "delete-operation"
              );
            }

            setProgressInfo(null);

            // Clear selection after all operations
            gallery.selection.clearMultiSelect();
            gallery.selection.clearFolderMultiSelect();
            
            // Force a refetch
            gallery.invalidate();
            await gallery.refetch();
            
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </Show>
    </>
  );
};

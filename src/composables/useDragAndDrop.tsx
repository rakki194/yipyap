/**
 * DragAndDrop.tsx
 * 
 * A composable for handling file drag and drop operations in the gallery.
 * Provides functionality for file upload with progress tracking, size validation,
 * and proper drag state management. Supports multiple file uploads with a 100MB
 * per file size limit.
 */

import { onCleanup } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";
import { useFileUpload } from "./useFileUpload";

/**
 * Props for configuring drag and drop behavior
 */
export interface DragAndDropProps {
  onDragStateChange: (isDragging: boolean) => void;
}

/**
 * Hook that implements drag and drop file upload functionality.
 * Handles drag events, file validation, upload progress tracking,
 * and provides feedback through the notification system.
 */
export const useDragAndDrop = ({ onDragStateChange }: DragAndDropProps) => {
  const gallery = useGallery();
  const appContext = useAppContext();
  const { uploadFiles } = useFileUpload();
  const t = appContext.t;
  let dragCounter = 0;

  /**
   * Handles the dragenter event, incrementing the drag counter
   * and updating the drag state.
   */
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show upload overlay for external files
    if (e.dataTransfer?.types.includes('Files')) {
      dragCounter++;
      onDragStateChange(true);
    }
  };

  /**
   * Handles the dragleave event, decrementing the drag counter
   * and updating the drag state when appropriate.
   */
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only handle external file drags
    if (e.dataTransfer?.types.includes('Files')) {
      dragCounter--;
      if (dragCounter === 0) {
        onDragStateChange(false);
      }
    }

    // Handle drag-target class only if target is a directory
    const target = e.target as HTMLElement;
    const directoryItem = target.closest('.directory');
    if (directoryItem) {
      directoryItem.classList.remove('drag-target');
    }
  };

  /**
   * Handles the dragover event, setting the appropriate drop effect.
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer) return;

    // Check if this is a gallery item drag
    if (e.dataTransfer.types.includes('application/x-yipyap-item') ||
        e.dataTransfer.types.includes('application/x-yipyap-items')) {
      e.dataTransfer.dropEffect = 'move';
      // Add drag-target class only if target is a directory
      const target = e.target as HTMLElement;
      const directoryItem = target.closest('.directory');
      if (directoryItem) {
        directoryItem.classList.add('drag-target');
      }
    } else if (e.dataTransfer.types.includes('Files')) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  /**
   * Handles the drop event, processing dropped files or gallery items.
   */
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);
    dragCounter = 0;

    if (!e.dataTransfer) return;

    // Handle gallery item drops
    if (e.dataTransfer.types.includes('application/x-yipyap-item') ||
        e.dataTransfer.types.includes('application/x-yipyap-items')) {
      const itemData = e.dataTransfer.getData('application/x-yipyap-item');
      const itemsData = e.dataTransfer.getData('application/x-yipyap-items');
      
      try {
        const item = JSON.parse(itemData);
        const items = itemsData ? JSON.parse(itemsData) : [item];
        
        // Get source path and target directory path
        const sourcePath = item.path || "";  // Empty string for root directory

        // Get the target directory path
        let targetPath = gallery.data()?.path ?? "";
        const targetElement = e.target as HTMLElement;
        const directoryItem = targetElement.closest('.item.directory') as HTMLElement;
        if (directoryItem) {
          // If dropped on a directory item, use its path
          const dirPath = directoryItem.getAttribute('data-path') || "";
          const dirName = directoryItem.getAttribute('data-name') || "";
          targetPath = dirPath ? `${dirPath}/${dirName}` : dirName;
        }

        // Only check for same directory if moving between directories
        if (sourcePath === targetPath) {
          // NOTE: Don't uncomment the toast and don't remove it.
          //                    I like it here!
          //appContext.notify(
          //  t("gallery.sameDirectoryMove"),
          //  "info"
          //);
          return;
        }
        
        // Call the move API
        const response = await fetch(`/api/move/${sourcePath}?target=${encodeURIComponent(targetPath)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: items.map((i: any) => i.name),
            preserve_latents: appContext.preserveLatents,
            preserve_txt: appContext.preserveTxt
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Move failed: ${response.statusText}\n${errorText}`);
        }

        const result = await response.json();
        
        // Show success/failure notifications
        if (result.moved.length > 0) {
          appContext.notify(
            t("gallery.moveComplete", { count: result.moved.length }),
            "success"
          );
        }
        
        if (result.failed.length > 0) {
          const existingFiles = result.failed.filter((file: string) => result.failed_reasons[file] === "target_exists");
          const missingFiles = result.failed.filter((file: string) => result.failed_reasons[file] === "source_missing");
          const otherFiles = result.failed.filter((file: string) => !["target_exists", "source_missing"].includes(result.failed_reasons[file]));

          // Clean up any existing animations
          document.querySelectorAll('.move-failed').forEach(el => {
            el.classList.remove('move-failed');
          });

          // Handle animations after a short delay to ensure DOM is ready
          setTimeout(() => {
            result.failed.forEach((file: string) => {
              // Try both directory and image items
              const selector = `#gallery .responsive-grid .item[data-name="${CSS.escape(file)}"]`;
              const item = document.querySelector(selector);
              
              if (item) {
                // Remove any drag-related classes that might interfere
                item.classList.remove('being-dragged', 'drag-target');
                
                // Force a reflow before adding the animation class
                void (item as HTMLElement).offsetWidth;
                
                // Add animation class
                item.classList.add('move-failed');
                
                // Remove the class after animation completes
                setTimeout(() => {
                  item.classList.remove('move-failed');
                }, 400);
              }
            });
          }, 50); // Small delay to ensure DOM is ready

          if (existingFiles.length > 0) {
            appContext.notify(
              t("gallery.moveFailedExists", { files: existingFiles.join(", ") }),
              "error"
            );
          }
          
          if (missingFiles.length > 0) {
            appContext.notify(
              t("gallery.moveFailedMissing", { files: missingFiles.join(", ") }),
              "error"
            );
          }

          // NOTE: Don't uncomment the toast and don't remove it.
          // this error happens when a folder is multiselected and dropped on the same folder it already exists in.
          // and probably other cases.
          if (otherFiles.length > 0) {
            //appContext.notify(
            //  t("gallery.moveFailed", { files: otherFiles.join(", ") }),
            //  "error"
            //);
            console.log("Move failed", otherFiles);
          }
        }

        // Only refetch if something actually moved
        if (result.moved.length > 0) {
          // Refresh both source and target directories
          gallery.refetchGallery();
        }
        
        return;
      } catch (err) {
        console.error('Failed to move items:', err);
        appContext.notify(
          t("gallery.moveError", { error: err instanceof Error ? err.message : "Unknown error" }),
          "error"
        );
        return;
      }
    }

    // Handle external file drops
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    await uploadFiles(files);
  };

  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    const draggableItem = target.closest('.item');
    if (!draggableItem) return;

    const idx = parseInt(draggableItem.getAttribute('data-idx') || '');
    if (isNaN(idx)) return;

    // Always add being-dragged class to the dragged item
    draggableItem.classList.add('being-dragged');

    // Check if the dragged item is part of any multi-selection
    const isInImageSelection = gallery.selection.multiSelected.has(idx);
    const isInFolderSelection = gallery.selection.multiFolderSelected.has(idx);

    if (isInImageSelection || isInFolderSelection) {
      // Add being-dragged class to all selected images
      document.querySelectorAll('.item.image').forEach(el => {
        const itemIdx = parseInt(el.getAttribute('data-idx') || '');
        if (!isNaN(itemIdx) && gallery.selection.multiSelected.has(itemIdx)) {
          el.classList.add('being-dragged');
        }
      });

      // Add being-dragged class to all selected folders
      document.querySelectorAll('.item.directory').forEach(el => {
        const itemIdx = parseInt(el.getAttribute('data-idx') || '');
        if (!isNaN(itemIdx) && gallery.selection.multiFolderSelected.has(itemIdx)) {
          el.classList.add('being-dragged');
        }
      });
    }

    // Set up drag data transfer
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      const itemData = {
        type: draggableItem.classList.contains('directory') ? 'directory' : 'image',
        name: draggableItem.getAttribute('data-name') || '',
        path: draggableItem.getAttribute('data-path') || ''
      };
      e.dataTransfer.setData('application/x-yipyap-item', JSON.stringify(itemData));

      // If part of multi-selection, add all selected items data
      if (isInImageSelection || isInFolderSelection) {
        const selectedItems = Array.from(document.querySelectorAll('.item.being-dragged')).map(el => ({
          type: el.classList.contains('directory') ? 'directory' : 'image',
          name: el.getAttribute('data-name') || '',
          path: el.getAttribute('data-path') || ''
        }));
        e.dataTransfer.setData('application/x-yipyap-items', JSON.stringify(selectedItems));
      }
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    // Clean up any remaining drag-related classes
    document.querySelectorAll('.being-dragged, .drag-target').forEach(el => {
      el.classList.remove('being-dragged', 'drag-target');
    });
  };

  // Add document-level drag event listeners
  document.addEventListener('dragenter', handleDragEnter);
  document.addEventListener('dragleave', handleDragLeave);
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragend', handleDragEnd);

  onCleanup(() => {
    document.removeEventListener('dragenter', handleDragEnter);
    document.removeEventListener('dragleave', handleDragLeave);
    document.removeEventListener('dragover', handleDragOver);
    document.removeEventListener('drop', handleDrop);
    document.removeEventListener('dragstart', handleDragStart);
    document.removeEventListener('dragend', handleDragEnd);
  });

  return {
    uploadFiles
  };
} 
/**
 * DragAndDrop.tsx
 * 
 * A composable for handling file drag and drop operations in the gallery.
 * Provides functionality for file upload with progress tracking, size validation,
 * and proper drag state management. Supports multiple file uploads with a 100MB
 * per file size limit.
 * 
 * Usage Guide:
 * 
 * Import and Initialize:
 *    ```tsx
 *    import { useDragAndDrop } from '~/composables/useDragAndDrop';
 *    
 *    const MyComponent = () => {
 *      const handleDragStateChange = (isDragging: boolean) => {
 *        // Update UI state based on drag status
 *        setShowDropOverlay(isDragging);
 *      };
 *    
 *      const { uploadFiles } = useDragAndDrop({ onDragStateChange: handleDragStateChange });
 *      // ...
 *    };
 *    ```
 * 
 * Features:
 *    - External File Upload: Handles drag and drop of files from outside the application
 *    - Gallery Item Movement: Supports dragging items between directories
 *    - Multi-Selection: Works with both single items and multiple selected items
 *    - Progress Tracking: Shows upload progress through the notification system
 *    - Validation: Automatically validates file sizes and types
 * 
 * 3. Drag States:
 *    - The onDragStateChange callback is triggered when:
 *      - Files are dragged over the application (isDragging = true)
 *      - Files leave the drop zone (isDragging = false)
 *      - Files are dropped (isDragging = false)
 * 
 * 4. Gallery Item Movement:
 *    - Items can be dragged between directories
 *    - Visual feedback shows valid drop targets
 *    - Supports moving multiple selected items at once
 *    - Preserves latents and txt files based on app settings
 * 
 * 5. Error Handling:
 *    - Failed moves are reported through notifications
 *    - Visual feedback for failed operations
 *    - Detailed error messages for common scenarios
 * 
 * Note: This composable is designed to work with the GalleryContext and AppContext.
 * Make sure these contexts are available in your component tree.
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
        
        console.log('Drag and drop items:', {
          singleItem: item,
          multiItems: items,
          itemsData: itemsData,
          selectionState: {
            multiSelected: Array.from(gallery.selection.multiSelected),
            multiFolderSelected: Array.from(gallery.selection.multiFolderSelected)
          }
        });
        
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

        // Ensure we have all selected items
        const data = gallery.data();
        if (!data) return;

        // Add any missing selected items
        const selectedItems = new Set(items.map((item: DragItem) => item.idx));
        const allItems = [...items];

        // Add any selected images that weren't in the drag data
        Array.from(gallery.selection.multiSelected).forEach(idx => {
          if (!selectedItems.has(idx)) {
            const item = data.items[idx];
            if (item?.type === 'image') {
              allItems.push({
                type: 'image' as const,
                name: item.file_name,
                path: data.path || '',
                idx
              });
            }
          }
        });

        // Add any selected folders that weren't in the drag data
        Array.from(gallery.selection.multiFolderSelected).forEach(idx => {
          if (!selectedItems.has(idx)) {
            const item = data.items[idx];
            if (item?.type === 'directory') {
              allItems.push({
                type: 'directory' as const,
                name: item.file_name,
                path: data.path || '',
                idx
              });
            }
          }
        });

        // Group items by their source path to handle multiple moves
        interface DragItem {
          type: 'directory' | 'image';
          name: string;
          path: string;
          idx: number;
        }

        const itemsByPath = allItems.reduce((acc: { [key: string]: DragItem[] }, item: DragItem) => {
          const sourcePath = item.path || "";
          if (!acc[sourcePath]) {
            acc[sourcePath] = [];
          }
          acc[sourcePath].push(item);
          return acc;
        }, {});

        console.log('Items grouped by path:', {
          itemsByPath,
          totalItems: allItems.length,
          itemTypes: allItems.map((i: DragItem) => i.type),
          paths: Object.keys(itemsByPath),
          targetPath
        });

        // Process each group of items separately
        const moveResults = await Promise.all(
          (Object.entries(itemsByPath) as [string, DragItem[]][]).map(async ([sourcePath, pathItems]) => {
            // Skip if source and target are the same
            if (sourcePath === targetPath) {
              console.log('Skipping same directory:', { sourcePath, targetPath });
              return null;
            }

            const movePayload = {
              items: pathItems.map((i: DragItem) => i.name),
              preserve_latents: appContext.preserveLatents,
              preserve_txt: appContext.preserveTxt
            };

            console.log('Move API payload:', {
              sourcePath,
              targetPath,
              payload: movePayload,
              itemsCount: pathItems.length,
              itemTypes: pathItems.map((i: DragItem) => i.type)
            });

            const response = await fetch(`/api/move/${sourcePath}?target=${encodeURIComponent(targetPath)}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(movePayload)
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Move API error:', {
                sourcePath,
                status: response.status,
                statusText: response.statusText,
                error: errorText
              });
              throw new Error(`Move failed for ${sourcePath}: ${response.statusText}\n${errorText}`);
            }

            return await response.json();
          })
        );

        // Combine all results
        const result = moveResults.reduce((acc: any, curr: any) => {
          if (!curr) return acc;
          return {
            moved: [...(acc.moved || []), ...curr.moved],
            failed: [...(acc.failed || []), ...curr.failed],
            failed_reasons: { ...(acc.failed_reasons || {}), ...curr.failed_reasons }
          };
        }, { moved: [], failed: [], failed_reasons: {} });

        console.log('Combined move results:', result);
        
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
          }, 50);

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
          // Clear selections after successful move
          gallery.selection.multiSelected.clear();
          gallery.selection.multiFolderSelected.clear();
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

    // Set up drag data transfer
    if (!e.dataTransfer) return;

    e.dataTransfer.effectAllowed = 'move';
    
    // Get the gallery data once to avoid multiple calls
    const data = gallery.data();
    if (!data) return;

    // Determine if this is a directory or image being dragged
    const isDraggingDirectory = draggableItem.classList.contains('directory');
    const itemData = {
      type: isDraggingDirectory ? 'directory' as const : 'image' as const,
      name: draggableItem.getAttribute('data-name') || '',
      path: data.path || '',
      idx: idx
    };

    // If part of multi-selection, add all selected items data
    if (isInImageSelection || isInFolderSelection) {
      // Get selected images using the multiSelected set
      const selectedImages = Array.from(gallery.selection.multiSelected)
        .map(idx => {
          const item = data.items[idx];
          // Make sure we're getting an image item
          if (!item || item.type !== 'image') return null;
          return {
            type: 'image' as const,
            name: item.file_name,
            path: data.path || '',
            idx
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      // Get selected folders using the multiFolderSelected set
      const selectedFolders = Array.from(gallery.selection.multiFolderSelected)
        .map(idx => {
          const item = data.items[idx];
          // Make sure we're getting a directory item
          if (!item || item.type !== 'directory') return null;
          return {
            type: 'directory' as const,
            name: item.file_name,
            path: data.path || '',
            idx
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      // Combine both selections
      const selectedItems = [...selectedImages, ...selectedFolders];
      
      // If the dragged item isn't in the selection, add it
      if (!selectedItems.some(item => item.idx === idx)) {
        selectedItems.push(itemData);
      }

      console.log('Setting drag data:', {
        selectedImages,
        selectedFolders,
        combinedItems: selectedItems,
        draggedItem: itemData,
        selectionSets: {
          multiSelected: Array.from(gallery.selection.multiSelected),
          multiFolderSelected: Array.from(gallery.selection.multiFolderSelected)
        },
        galleryData: {
          itemsCount: data.items.length,
          selectedItemTypes: selectedItems.map(i => i.type)
        }
      });

      // Set both the single item and multi-item data
      e.dataTransfer.setData('application/x-yipyap-item', JSON.stringify(itemData));
      e.dataTransfer.setData('application/x-yipyap-items', JSON.stringify(selectedItems));

      // Add being-dragged class to all selected items
      selectedItems.forEach(item => {
        const selector = `#gallery .responsive-grid .item[data-idx="${item.idx}"]`;
        const el = document.querySelector(selector);
        if (el) {
          el.classList.add('being-dragged');
        }
      });
    } else {
      // Single item drag
      console.log('Single item drag:', {
        itemData,
        type: isDraggingDirectory ? 'directory' : 'image'
      });
      e.dataTransfer.setData('application/x-yipyap-item', JSON.stringify(itemData));
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
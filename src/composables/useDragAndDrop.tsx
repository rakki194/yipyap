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
  const t = appContext.t;
  let dragCounter = 0;
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file

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

        console.log('Move paths:', {
          sourcePath,
          targetPath,
          item,
          items,
          targetElement,
          isDirectory: !!directoryItem
        });

        // Only check for same directory if moving between directories
        if (item.type === 'directory' && sourcePath === targetPath) {
          appContext.notify(
            t("gallery.sameDirectoryMove"),
            "info"
          );
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
          appContext.notify(
            t("gallery.moveFailed", { files: result.failed.join(", ") }),
            "error"
          );
        }

        // Refresh both source and target directories
        gallery.invalidate();
        gallery.refetch();
        
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

  /**
   * Processes and uploads the provided files, handling size validation,
   * progress tracking, and error states.
   * 
   * - Validates individual file sizes (max 100MB)
   * - Tracks upload progress
   * - Provides feedback through notifications
   * - Refreshes gallery on successful upload
   */
  const uploadFiles = async (files: FileList) => {
    const t = appContext.t;
    const formData = new FormData();
    let totalSize = 0;
    let oversizedFiles = [];

    // Check file sizes and add to form data
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
        continue;
      }
      totalSize += file.size;
      formData.append("files", file);
    }

    if (oversizedFiles.length > 0) {
      appContext.notify(
        t("gallery.filesExceedLimit", { files: oversizedFiles.join(", ") }),
        "error",
        "file-upload"
      );
      return;
    }

    if (totalSize === 0) {
      appContext.notify(
        t("gallery.noFilesToUpload"),
        "error",
        "file-upload"
      );
      return;
    }

    appContext.notify(
      t("gallery.processingFiles"),
      "info",
      "file-upload",
      "spinner"
    );

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/upload/${gallery.data()?.path}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        appContext.createNotification({
          message: t("gallery.uploadProgressPercent", { progress }),
          type: "info",
          group: "file-upload",
          icon: "spinner",
          progress
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        appContext.notify(
          t("gallery.uploadComplete"),
          "success",
          "file-upload"
        );
        gallery.invalidate();
        gallery.refetch();
      } else {
        appContext.notify(
          t("gallery.uploadFailed", { error: xhr.statusText }),
          "error",
          "file-upload"
        );
      }
    };

    xhr.onerror = () => {
      appContext.notify(
        t("gallery.uploadFailed", { error: "Network error" }),
        "error",
        "file-upload"
      );
    };

    xhr.send(formData);
  };

  // Add document-level drag event listeners
  document.addEventListener('dragenter', handleDragEnter);
  document.addEventListener('dragleave', handleDragLeave);
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);

  onCleanup(() => {
    document.removeEventListener('dragenter', handleDragEnter);
    document.removeEventListener('dragleave', handleDragLeave);
    document.removeEventListener('dragover', handleDragOver);
    document.removeEventListener('drop', handleDrop);
  });

  return {
    uploadFiles
  };
}; 
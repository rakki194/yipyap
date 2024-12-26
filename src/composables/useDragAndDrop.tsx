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
  let dragCounter = 0;
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file

  /**
   * Handles the dragenter event, incrementing the drag counter
   * and updating the drag state.
   */
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    onDragStateChange(true);
  };

  /**
   * Handles the dragleave event, decrementing the drag counter
   * and updating the drag state when appropriate.
   */
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      onDragStateChange(false);
    }
  };

  /**
   * Handles the dragover event, setting the drop effect to 'copy'.
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  /**
   * Handles the drop event, processing dropped files and initiating
   * the upload process.
   */
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    onDragStateChange(false);
    dragCounter = 0;

    const files = e.dataTransfer?.files;
    if (!files) return;

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
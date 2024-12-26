/**
 * DragAndDrop.tsx
 * 
 * A composable for handling file drag and drop operations in the gallery.
 * Provides functionality for drag state management and integrates with
 * the file upload system.
 */

import { onCleanup } from "solid-js";
import { useFileUpload } from "./useFileUpload";

/**
 * Props for configuring drag and drop behavior
 */
export interface DragAndDropProps {
  onDragStateChange: (isDragging: boolean) => void;
}

/**
 * Hook that implements drag and drop file upload functionality.
 * Handles drag events and integrates with the file upload system.
 */
export const useDragAndDrop = ({ onDragStateChange }: DragAndDropProps) => {
  const { uploadFiles } = useFileUpload();
  let dragCounter = 0;

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
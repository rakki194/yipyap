// src/components/Gallery/Gallery.tsx
import { Show, onMount, onCleanup, createSignal, createMemo } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import { useAction, useNavigate } from "@solidjs/router";
import "./Gallery.css";
import { QuickJump } from "./QuickJump";
import { useAppContext } from "~/contexts/app";

export const Gallery = () => {
  const navigate = useNavigate();
  const gallery = useGallery();
  const appContext = useAppContext();
  const deleteImageAction = useAction(gallery.deleteImage);
  const [showQuickJump, setShowQuickJump] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  const [dragOverPath, setDragOverPath] = createSignal<string | null>(null);
  let dragCounter = 0;
  const [uploadProgress, setUploadProgress] = createSignal<{current: number, total: number} | null>(null);
  const [currentFile, setCurrentFile] = createSignal<string | null>(null);

  const keyDownHandler = (event: KeyboardEvent) => {
    // Returns when we don't act on the event, preventDefault for acted-upon event, present in the epilogue.
    if (!event) return;

    // Don't act if a input element is focused
    const activeElement = document.activeElement as HTMLElement;
    if (
      activeElement &&
      (activeElement.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(activeElement.tagName))
    ) {
      return;
    }

    // Don't act if a modifier key is pressed
    if (event.shiftKey || event.altKey || event.ctrlKey) {
      return;
    }

    const data = gallery.data();
    if (!data) return;

    if (event.key === "ArrowRight") {
      if (!gallery.selectNext()) return;
    } else if (event.key === "ArrowLeft") {
      if (!gallery.selectPrev()) return;
    } else if (event.key === "ArrowDown") {
      if (!gallery.selectDown()) return;
    } else if (event.key === "ArrowUp") {
      if (!gallery.selectUp()) return;
    } else if (event.key === "Enter") {
      // Don't intercept if no selection and in root directory
      if (gallery.selected === null && data.path === "") return;

      const selImageItem =
        gallery.selected !== null
          ? data.items[gallery.selected]
          : { type: "directory", file_name: ".." };
      if (selImageItem.type === "directory") {
        navigate(`/gallery/${data.path}/${selImageItem.file_name}`);
      } else {
        if (!gallery.toggleEdit()) return;
      }
    } else if (event.key === "Escape") {
      if (gallery.mode === "view") {
        if (gallery.selected === null) {
          gallery.select(null);
        } else return;
      }
      if (!gallery.setMode("view")) return;
    } else if (event.key === "Backspace") {
      const segments = data.path.split("/");
      if (segments.length < 1) return;
      navigate(`/gallery/${segments.slice(0, -1).join("/")}`);
    } else if (event.key === "Delete" && gallery.selectedImage !== null) {
      const data = gallery.data();
      if (!data) return;
      const imagePath = data.path
        ? `${data.path}/${gallery.selectedImage.name}`
        : gallery.selectedImage.name;
      deleteImage(imagePath);
    } else if (event.key === "q") {
      setShowQuickJump(true);
      event.preventDefault();
      return;
    } else {
      return;
    }
    event.preventDefault();
  };

  const deleteImage = async (imagePath: string) => {
    const params = new URLSearchParams();
    params.append("confirm", "true");

    // Include new settings
    if (appContext.preserveLatents) {
      params.append("preserve_latents", "true");
    }
    if (appContext.preserveTxt) {
      params.append("preserve_txt", "true");
    }

    try {
      const response = await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete image.");
      }
      // Refresh gallery or update UI as needed
    } catch (error) {
      console.error("Error deleting image:", error);
      // Handle error (e.g., show notification)
    }
  };

  onMount(() => {
    window.addEventListener("keydown", keyDownHandler);
    onCleanup(() => window.removeEventListener("keydown", keyDownHandler));
  });

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const uploadFiles = async (formData: FormData, url: string) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          setUploadProgress({
            current: event.loaded,
            total: event.total
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(xhr.statusText));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });

      xhr.open('POST', url);
      xhr.send(formData);

      // Return abort function for cleanup
      return () => xhr.abort();
    });
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter = 0;

    const items = e.dataTransfer?.items;
    if (!items) return;

    try {
      const formData = new FormData();
      const files: File[] = [];
      
      // Show initial processing message
      setCurrentFile(appContext.t('gallery.processingFiles'));
      
      // Process all dropped items
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item) {
          await traverseFileTree(item, '', files);
        }
      }

      if (files.length === 0) {
        setCurrentFile(null);
        return;
      }

      // Set initial progress
      setUploadProgress({ 
        current: 0, 
        total: files.reduce((acc, file) => acc + file.size, 0) 
      });

      // Add all collected files to formData
      for (const file of files) {
        const relativePath = file.webkitRelativePath || file.name;
        formData.append('files', file, relativePath);
        setCurrentFile(relativePath);
      }

      const currentPath = gallery.data()?.path || '';
      const uploadUrl = currentPath 
        ? `/api/upload/${currentPath}`
        : '/api/upload';
      
      await uploadFiles(formData, uploadUrl);
      
      // Clear progress indicators
      setUploadProgress(null);
      setCurrentFile(null);
      
      // Refresh gallery
      gallery.refetch();
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadProgress(null);
      setCurrentFile(null);
      
      // Show error message in a way that's compatible with the current context
      const errorMessage = error instanceof Error ? error.message : appContext.t('gallery.uploadError');
      // You can either:
      // 1. Use a toast/notification system if available in your app
      // 2. Set an error state to display in the UI
      // 3. Use the browser's built-in alert for now (temporary solution)
      alert(errorMessage);
    }
  };

  // Helper function to traverse directory structure
  const traverseFileTree = async (
    item: FileSystemEntry,
    path: string,
    files: File[]
  ): Promise<void> => {
    if (item.isFile) {
      const fileEntry = item as FileSystemFileEntry;
      const file = await new Promise<File>((resolve) => {
        fileEntry.file((file) => {
          // Create a new File object with the full path
          const newFile = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          });
          // Add the relative path information
          Object.defineProperty(newFile, 'webkitRelativePath', {
            value: path + file.name
          });
          resolve(newFile);
        });
      });
      files.push(file);
    } else if (item.isDirectory) {
      const dirEntry = item as FileSystemDirectoryEntry;
      const dirReader = dirEntry.createReader();
      const entries = await new Promise<FileSystemEntry[]>((resolve) => {
        dirReader.readEntries((entries) => resolve(entries));
      });
      
      for (const entry of entries) {
        await traverseFileTree(
          entry,
          path + item.name + '/',
          files
        );
      }
    }
  };

  return (
    <>
      {/* <Controls /> */}

      <div
        id="gallery"
        class="gallery"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
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

        {/* Upload Progress Overlay */}
        <Show when={uploadProgress()}>
          {(progress) => (
            <div class="upload-progress-overlay">
              <div class="upload-progress-container">
                <Show when={currentFile()}>
                  <div class="upload-current-file">
                    {currentFile()}
                  </div>
                </Show>
                <div class="upload-progress-bar">
                  <div 
                    class="upload-progress-fill"
                    style={{
                      width: `${(progress().current / progress().total) * 100}%`
                    }}
                  />
                </div>
                <div class="upload-progress-text">
                  {`${Math.round((progress().current / progress().total) * 100)}%`}
                </div>
              </div>
            </div>
          )}
        </Show>

        {/* Dropzone Overlay */}
        <div
          class="gallery-dropzone"
          classList={{ dragging: isDragging() }}
        >
          {isDragging() && <div class="drop-overlay">{appContext.t('gallery.dropOverlay')}</div>}
        </div>
      </div>

      <Show when={gallery.getEditedImage()}>
        {(image) => (
          /* FIXME: this is messy, we should just pass the imageInfo,
        but the captions might change more often */ <ImageModal
            imageInfo={image()}
            captions={image().captions}
            onClose={() => gallery.setMode("view")}
          />
        )}
      </Show>
      <Show when={showQuickJump()}>
        <QuickJump onClose={() => setShowQuickJump(false)} />
      </Show>
    </>
  );
};

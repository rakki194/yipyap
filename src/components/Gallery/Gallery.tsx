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
  const [progressInfo, setProgressInfo] = createSignal<{
    current: number;
    total: number;
    type: 'upload' | 'delete';
    message: string;
  } | null>(null);

  const keyDownHandler = (event: KeyboardEvent) => {
    // Returns when we don't act on the event, preventDefault for acted-upon event, present in the epilogue.
    if (!event) return;

    // Don't act if a input element is focused
    const activeElement = document.activeElement as HTMLElement;
    if (
      activeElement &&
      (activeElement.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(activeElement.tagName) ||
        activeElement.closest(".caption-input-wrapper, .image-modal, .modal"))
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

    if (appContext.preserveLatents) {
      params.append("preserve_latents", "true");
    }
    if (appContext.preserveTxt) {
      params.append("preserve_txt", "true");
    }

    try {
      setProgressInfo({
        current: 0,
        total: 1,
        type: 'delete',
        message: appContext.t('gallery.deletingFile')
      });

      const response = await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete image.");
      }

      setProgressInfo({
        current: 1,
        total: 1,
        type: 'delete',
        message: appContext.t('gallery.fileDeleteSuccess')
      });

      // Clear the progress after a short delay
      setTimeout(() => setProgressInfo(null), 2000);
    } catch (error) {
      console.error("Error deleting image:", error);
      setProgressInfo({
        current: 1,
        total: 1,
        type: 'delete',
        message: appContext.t('gallery.fileDeleteError')
      });
      setTimeout(() => setProgressInfo(null), 3000);
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
      
      // Process all dropped items in parallel
      const filePromises = Array.from(items).map(item => {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          return traverseFileTree(entry, '', files);
        }
        return Promise.resolve();
      });

      await Promise.all(filePromises);

      if (files.length === 0) {
        setCurrentFile(null);
        return;
      }

      // Update initial progress
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      setProgressInfo({
        current: 0,
        total: totalSize,
        type: 'upload',
        message: appContext.t('gallery.uploadProgress').replace('{count}', files.length.toString())
      });

      // Add all collected files to formData
      files.forEach(file => {
        const relativePath = file.webkitRelativePath || file.name;
        formData.append('files', file, relativePath);
        if (import.meta.env.DEV) {
          console.debug('Adding file to upload:', relativePath);
        }
      });

      const currentPath = gallery.data()?.path || '';
      const uploadUrl = currentPath 
        ? `/api/upload/${currentPath}`
        : '/api/upload';
      
      // Show total files being uploaded
      setCurrentFile(appContext.t('gallery.uploadProgress').replace('{count}', files.length.toString()));
      
      await uploadFiles(formData, uploadUrl);
      
      // Clear progress on success
      setProgressInfo(null);
      setCurrentFile(null);
      
      // Refresh gallery
      gallery.refetch();
      
    } catch (error) {
      console.error('Error uploading files:', error);
      setProgressInfo({
        current: 0,
        total: 1,
        type: 'upload',
        message: appContext.t('gallery.uploadError')
      });
      setTimeout(() => setProgressInfo(null), 3000);
    }
  };

  // Update traverseFileTree to better handle directory entries
  const traverseFileTree = async (
    item: FileSystemEntry,
    path: string,
    files: File[]
  ): Promise<void> => {
    if (item.isFile) {
      const fileEntry = item as FileSystemFileEntry;
      const file = await new Promise<File>((resolve, reject) => {
        fileEntry.file(
          (file) => {
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
          },
          reject
        );
      });
      files.push(file);
      if (import.meta.env.DEV) {
        console.debug('Found file:', path + file.name);
      }
    } else if (item.isDirectory) {
      const dirEntry = item as FileSystemDirectoryEntry;
      const dirReader = dirEntry.createReader();
      
      // Read all entries in the directory
      const entries: FileSystemEntry[] = [];
      let readResults;
      do {
        readResults = await new Promise<FileSystemEntry[]>((resolve, reject) => {
          dirReader.readEntries(resolve, reject);
        });
        entries.push(...readResults);
      } while (readResults.length > 0);
      
      // Process all entries in parallel
      await Promise.all(
        entries.map(entry => 
          traverseFileTree(
            entry,
            path + item.name + '/',
            files
          )
        )
      );
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

        {/* Update progress overlay */}
        <Show when={progressInfo()}>
          {(progress) => (
            <div class="upload-progress-overlay">
              <div class="upload-progress-container">
                <div class="upload-current-file">
                  {progress().message}
                </div>
                <div class="upload-progress-bar">
                  <div 
                    class="upload-progress-fill"
                    classList={{
                      'delete': progress().type === 'delete'
                    }}
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

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

/**
 * Main Gallery component that handles:
 * - Image grid display and navigation
 * - Keyboard shortcuts for navigation and actions
 * - Drag and drop file upload functionality
 * - Progress indicators for uploads and deletions
 * - Quick jump navigation
 * 
 * @component
 * @example
 * <Gallery />
 */
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
  const [isScrolling, setIsScrolling] = createSignal(false);
  const scrollTimeout = createMemo(() => 300); // Adjust scroll animation duration as needed

  const smoothScroll = (targetY: number) => {
    if (isScrolling()) return;
    
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    setIsScrolling(true);
    
    const startY = gallery.scrollTop;
    const distance = targetY - startY;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / scrollTimeout(), 1);
      
      // Use easeInOutQuad easing function for smooth animation
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      gallery.scrollTop = startY + (distance * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsScrolling(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const handleWheel = (e: WheelEvent) => {
    if (isScrolling()) {
      e.preventDefault();
      return;
    }

    const galleryElement = document.getElementById('gallery');
    if (!galleryElement) return;

    const scrollAmount = galleryElement.clientHeight * 0.75; // Adjust scroll amount as needed
    const targetY = galleryElement.scrollTop + (Math.sign(e.deltaY) * scrollAmount);
    
    smoothScroll(targetY);
    
    // Update selection based on scroll direction
    if (e.deltaY > 0) {
      gallery.selection.selectPageDown();
    } else {
      gallery.selection.selectPageUp();
    }
    
    e.preventDefault();
  };

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
      
      const selectedItem = data.items[gallery.selected!];
      if (!selectedItem || selectedItem.type !== 'image') return;
      
      deleteImageAction(gallery.selected!);
    } else if (event.key === "q") {
      setShowQuickJump(true);
      event.preventDefault();
      return;
    } else if (event.key === "PageUp") {
      event.preventDefault();
      const galleryElement = document.getElementById('gallery');
      if (!galleryElement) return;
      const targetY = galleryElement.scrollTop - (galleryElement.clientHeight * 0.75);
      smoothScroll(targetY);
      gallery.selection.selectPageUp();
    } else if (event.key === "PageDown") {
      event.preventDefault();
      const galleryElement = document.getElementById('gallery');
      if (!galleryElement) return;
      const targetY = galleryElement.scrollTop + (galleryElement.clientHeight * 0.75);
      smoothScroll(targetY);
      gallery.selection.selectPageDown();
    } else {
      return;
    }
    event.preventDefault();
  };

  onMount(() => {
    window.addEventListener("keydown", keyDownHandler);
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    onCleanup(() => {
      window.removeEventListener("keydown", keyDownHandler);
      const gallery = document.getElementById('gallery');
      if (gallery) {
        gallery.removeEventListener('wheel', handleWheel);
      }
    });
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

  /**
   * Uploads files to the server with progress tracking
   * 
   * @param formData - FormData containing files to upload
   * @param url - Target URL for upload
   * @returns Promise that resolves when upload is complete
   */
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

  /**
   * Recursively traverses a file system entry (file or directory)
   * and collects all files for upload
   * 
   * @param item - FileSystem entry to traverse
   * @param path - Current path in the traversal
   * @param files - Array to collect found files
   */
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

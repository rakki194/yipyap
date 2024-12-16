// src/components/Gallery/Gallery.tsx
import { Show, onMount, onCleanup, createSignal, createMemo, createEffect } from "solid-js";
import { Controls } from "./Controls";
import { ImageGrid } from "./ImageGrid";
import { ImageModal } from "../ImageViewer/ImageModal";
import { useGallery } from "~/contexts/GalleryContext";
import { useAction, useNavigate } from "@solidjs/router";
import "./Gallery.css";
import { QuickJump } from "./QuickJump";
import { useAppContext } from "~/contexts/app";

// Add new ScrollManager class to handle scroll logic
class ScrollManager {
  private element: HTMLElement | null = null;
  private isScrolling = false;
  private lastScrollTime = 0;
  private animationFrame: number | null = null;
  
  constructor(
    private readonly scrollTimeout: number,
    private readonly scrollDebounceTimeout: number
  ) {}

  init(element: HTMLElement) {
    this.element = element;
  }

  getScrollBounds() {
    if (!this.element) return { min: 0, max: 0 };
    return {
      min: 0,
      max: this.element.scrollHeight - this.element.clientHeight
    };
  }

  smoothScrollTo(targetY: number, force = false) {
    if (!this.element) return;
    if (!force && (this.isScrolling || Date.now() - this.lastScrollTime < this.scrollDebounceTimeout)) {
      return;
    }

    // Cancel any existing animation
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.lastScrollTime = Date.now();
    const bounds = this.getScrollBounds();
    targetY = Math.max(bounds.min, Math.min(bounds.max, targetY));

    const startY = this.element.scrollTop;
    const startTime = performance.now();
    this.isScrolling = true;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.scrollTimeout, 1);
      
      // Use easeInOutQuad easing
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      this.element!.scrollTop = startY + ((targetY - startY) * easeProgress);
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.element!.scrollTop = targetY;
        this.isScrolling = false;
        this.animationFrame = null;
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.isScrolling = false;
  }

  get isActive() {
    return this.isScrolling;
  }
}

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
  const scrollTimeout = createMemo(() => 200); // Reduce from 300 to 200ms for faster animation
  const scrollDebounceTimeout = createMemo(() => 16); // Reduce from 50 to 16ms (~1 frame) for more responsive input
  let lastScrollTime = 0;
  const [autoScrolling, setAutoScrolling] = createSignal(false);
  const [checkingPosition, setCheckingPosition] = createSignal(false);
  let positionCheckInterval: number | null = null;
  const [scrollAnimationState, setScrollAnimationState] = createSignal<{
    active: boolean;
    targetY: number | null;
    startTime: number | null;
    cleanup?: () => void;
  } | null>(null);
  const scrollManager = new ScrollManager(
    scrollTimeout(),
    scrollDebounceTimeout()
  );

  // Replace smoothScroll function
  const smoothScroll = (targetY: number, forceScroll = false) => {
    scrollManager.smoothScrollTo(targetY, forceScroll);
  };

  // Update scrollToSelected function
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
      }, scrollTimeout() + 50);
    }
  };

  // Update handleWheel function
  const handleWheel = (e: WheelEvent) => {
    if (scrollManager.isActive) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    const galleryElement = document.getElementById('gallery');
    if (!galleryElement) return;

    const success = e.deltaY > 0 
      ? gallery.selection.selectPageDown()
      : gallery.selection.selectPageUp();

    if (success) {
      scrollToSelected(true);
    } else {
      const bounds = scrollManager.getScrollBounds();
      const currentScroll = galleryElement.scrollTop;
      
      if ((e.deltaY > 0 && currentScroll < bounds.max) || 
          (e.deltaY < 0 && currentScroll > bounds.min)) {
        const scrollAmount = galleryElement.clientHeight * 0.5;
        const targetY = currentScroll + (Math.sign(e.deltaY) * scrollAmount);
        smoothScroll(targetY, true);
      }
    }
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
      scrollToSelected();
    } else if (event.key === "ArrowLeft") {
      if (!gallery.selectPrev()) return;
      scrollToSelected();
    } else if (event.key === "ArrowDown") {
      if (!gallery.selectDown()) return;
      scrollToSelected();
    } else if (event.key === "ArrowUp") {
      if (!gallery.selectUp()) return;
      scrollToSelected();
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
          setTimeout(() => setCheckingPosition(false), scrollTimeout());
        });
      }
    }, 500); // Check every 500ms
  };

  onMount(() => {
    window.addEventListener("keydown", keyDownHandler);
    const gallery = document.getElementById('gallery');
    if (gallery) {
      scrollManager.init(gallery);
      gallery.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    startPositionChecking(); // Start the position checking
    
    onCleanup(() => {
      window.removeEventListener("keydown", keyDownHandler);
      const gallery = document.getElementById('gallery');
      if (gallery) {
        gallery.removeEventListener('wheel', handleWheel);
      }
      // Clear the interval on cleanup
      if (positionCheckInterval) {
        clearInterval(positionCheckInterval);
        positionCheckInterval = null;
      }
      
      scrollManager.cleanup();
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

  createEffect(() => {
    const selected = gallery.selected;
    if (selected !== null && !autoScrolling()) {
      const frame = requestAnimationFrame(() => {
        scrollToSelected(true);
      });
      onCleanup(() => cancelAnimationFrame(frame));
    }
  });

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

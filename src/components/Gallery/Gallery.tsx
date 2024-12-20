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
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

// Add new ScrollManager class to handle scroll logic
class ScrollManager {
  private element: HTMLElement | null = null;
  private animationFrame: number | null = null;
  private isAnimating = false;
  
  constructor(private readonly scrollTimeout: number) {}

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
    if (!this.element || (!force && this.isAnimating)) return;

    // Cancel any existing animation
    this.cleanup();

    const bounds = this.getScrollBounds();
    targetY = Math.max(bounds.min, Math.min(bounds.max, targetY));

    const startY = this.element.scrollTop;
    const startTime = performance.now();
    this.isAnimating = true;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.scrollTimeout, 1);
      
      // Use easeInOutQuad easing
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      this.element!.scrollTop = startY + ((targetY - startY) * easeProgress);
      
      if (progress < 1 && this.isAnimating) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.element!.scrollTop = targetY;
        this.cleanup();
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.isAnimating = false;
  }

  get isActive() {
    return this.isAnimating;
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
  const [showDeleteConfirm, setShowDeleteConfirm] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  let dragCounter = 0;
  const [uploadProgress, setUploadProgress] = createSignal<{current: number, total: number} | null>(null);
  const [currentFile, setCurrentFile] = createSignal<string | null>(null);
  const [progressInfo, setProgressInfo] = createSignal<{
    current: number;
    total: number;
    type: 'upload' | 'delete';
    message: string;
  } | null>(null);
  const [isWheelScrolling, setWheelScrolling] = createSignal(false);
  const scrollTimeout = createMemo(() => 200);
  const [autoScrolling, setAutoScrolling] = createSignal(false);
  const [checkingPosition, setCheckingPosition] = createSignal(false);
  let positionCheckInterval: number | null = null;
  const scrollManager = new ScrollManager(
    scrollTimeout()
  );

  // Add state to track shift selection start point
  const [shiftSelectionStart, setShiftSelectionStart] = createSignal<number | null>(null);

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

  // Add these signals at the top of the Gallery component
  const [lastWheelTime, setLastWheelTime] = createSignal(0);
  const [isScrolling, setIsScrolling] = createSignal(false);
  const SCROLL_DEBOUNCE = 150; // ms for vertical scrolling
  const HORIZONTAL_SCROLL_DEBOUNCE = 50; // ms for horizontal scrolling

  // Add this at the top with other signals

  // Update handleWheel function
  const handleWheel = (e: WheelEvent) => {
    const galleryElement = document.getElementById('gallery');
    if (!galleryElement) return;

    // Check if it's a touchpad gesture (smooth scrolling)
    const isTouchpad = e.deltaMode === 0 && Math.abs(e.deltaY) < 50;
    
    if (isTouchpad) {
      const now = performance.now();
      setLastWheelTime(now);
      
      // Handle horizontal scrolling for touchpad
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        
        if (!isWheelScrolling()) {
          setWheelScrolling(true);
          // Start a new scroll session
          requestAnimationFrame(function checkScrollEnd() {
            const timeSinceLastWheel = performance.now() - lastWheelTime();
            
            if (timeSinceLastWheel < HORIZONTAL_SCROLL_DEBOUNCE) {
              // Still scrolling, check again next frame
              requestAnimationFrame(checkScrollEnd);
            } else {
              // Scrolling has stopped
              setWheelScrolling(false);
              
              // Immediate response to horizontal scroll
              const success = e.deltaX > 0 
                ? gallery.selection.selectPrev()
                : gallery.selection.selectNext();
                  
              if (success) {
                scrollToSelected(true);
              }
            }
          });
        } else {
          // Allow new scroll events while scrolling
          const success = e.deltaX > 0 
            ? gallery.selection.selectPrev()
            : gallery.selection.selectNext();
            
          if (success) {
            scrollToSelected(true);
          }
        }
        return;
      }
      
      // Handle vertical scrolling (existing touchpad logic)
      if (!isWheelScrolling()) {
        setWheelScrolling(true);
        // Start a new scroll session
        requestAnimationFrame(function checkScrollEnd() {
          const timeSinceLastWheel = performance.now() - lastWheelTime();
          
          if (timeSinceLastWheel < SCROLL_DEBOUNCE) {
            // Still scrolling, check again next frame
            requestAnimationFrame(checkScrollEnd);
          } else {
            // Scrolling has stopped
            setWheelScrolling(false);
            // Update selection based on final scroll position
            const success = e.deltaY > 0 
              ? gallery.selection.selectDown()
              : gallery.selection.selectUp();
              
            if (success) {
              scrollToSelected(true);
            }
          }
        });
      }
      return;
    }

    // Handle mouse wheel scrolling (existing logic)
    const bounds = scrollManager.getScrollBounds();
    const currentScroll = galleryElement.scrollTop;
    const canScrollUp = currentScroll > bounds.min;
    const canScrollDown = currentScroll < bounds.max;

    const success = e.deltaY > 0 
      ? gallery.selection.selectDown()
      : gallery.selection.selectUp();

    if (success) {
      e.preventDefault();
      scrollToSelected(true);
    } else if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
      e.preventDefault();
      if (!scrollManager.isActive) {
        const scrollAmount = galleryElement.clientHeight * 0.25;
        const targetY = currentScroll + (Math.sign(e.deltaY) * scrollAmount);
        smoothScroll(targetY, true);
      }
    }
  };

  const keyDownHandler = async (event: KeyboardEvent) => {
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

    const data = gallery.data();
    if (!data) return;

    // Handle shift+space for toggling multiselect
    if (event.key === " " && event.shiftKey) {
      event.preventDefault();
      if (gallery.selected !== null) {
        gallery.selection.toggleMultiSelect(gallery.selected);
      }
      return;
    }

    // Handle shift+arrow keys for multiple selection
    if (event.shiftKey && ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      let success = false;
      
      // Initialize shift selection start point if not set
      if (shiftSelectionStart() === null && gallery.selected !== null) {
        setShiftSelectionStart(gallery.selected);
      }

      // Move selection
      switch (event.key) {
        case "ArrowRight":
          success = gallery.selectNext();
          break;
        case "ArrowLeft":
          success = gallery.selectPrev();
          break;
        case "ArrowDown":
          success = gallery.selectDown();
          break;
        case "ArrowUp":
          success = gallery.selectUp();
          break;
      }

      if (success && gallery.selected !== null && shiftSelectionStart() !== null) {
        // Select all items between the shift start point and current position
        const start = Math.min(shiftSelectionStart()!, gallery.selected);
        const end = Math.max(shiftSelectionStart()!, gallery.selected);
        
        // Clear existing selection
        gallery.selection.clearMultiSelect();
        gallery.selection.clearFolderMultiSelect();
        
        // Add all items in range to multiselect
        for (let i = start; i <= end; i++) {
          const item = data.items[i];
          if (item?.type === 'image') {
            gallery.selection.toggleMultiSelect(i);
          } else if (item?.type === 'directory') {
            gallery.selection.toggleFolderMultiSelect(i);
          }
        }
        
        // Scroll to the current cursor position
        const currentElement = document.querySelector(
          `#gallery .responsive-grid .item:nth-child(${gallery.selected + 1})`
        );
        if (currentElement) {
          currentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
          });
        }
      }
      return;
    }

    // Reset shift selection start point when shift is not pressed
    if (!event.shiftKey) {
      setShiftSelectionStart(null);
    }

    // Don't act if other modifier keys are pressed
    if (event.altKey || event.ctrlKey) {
      return;
    }

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
    } else if (event.key === "Delete") {
      const data = gallery.data();
      if (!data) return;

      // Handle multi-selection delete
      if (gallery.selection.multiSelected.size > 0 || gallery.selection.multiFolderSelected.size > 0) {
        event.preventDefault();
        setShowDeleteConfirm(true);
      } else if (gallery.selected !== null) {
        // Handle single image delete
        const selectedItem = data.items[gallery.selected];
        if (selectedItem?.type === 'image') {
          event.preventDefault();
          try {
            await deleteImageAction(gallery.selected);
            appContext.createNotification({
              message: appContext.t('gallery.fileDeleteSuccess'),
              type: "success"
            });
          } catch (error) {
            appContext.createNotification({
              message: appContext.t('gallery.fileDeleteError'),
              type: "error"
            });
          }
        }
      }
    } else if (event.key === "q") {
      setShowQuickJump(true);
      event.preventDefault();
      return;
    } else if (event.key === "PageUp") {
      event.preventDefault();
      const galleryElement = document.getElementById('gallery');
      if (!galleryElement) return;
      const targetY = galleryElement.scrollTop - (galleryElement.clientHeight * 0.25);
      smoothScroll(targetY);
      gallery.selection.selectUp();
    } else if (event.key === "PageDown") {
      event.preventDefault();
      const galleryElement = document.getElementById('gallery');
      if (!galleryElement) return;
      const targetY = galleryElement.scrollTop + (galleryElement.clientHeight * 0.25);
      smoothScroll(targetY);
      gallery.selection.selectDown();
    } else if (event.key.toLowerCase() === "d" && event.shiftKey) {
      console.log("Shift+D detected"); // Debug log
      event.preventDefault();
      const data = gallery.data();
      if (!data || gallery.selected === null) {
        console.log("No data or no selection"); // Debug log
        return;
      }

      const selectedItem = data.items[gallery.selected];
      if (selectedItem?.type !== 'image') {
        console.log("Selected item is not an image:", selectedItem); // Debug log
        return;
      }

      try {
        // First check if the Clipboard API is supported
        if (!navigator.clipboard || !window.ClipboardItem) {
          console.log("Clipboard API not supported"); // Debug log
          throw new Error('Clipboard API not supported');
        }

        // Construct the image path correctly - preserve the exact path
        const imagePath = data.path
          ? `${data.path}/${selectedItem.file_name}`
          : selectedItem.file_name;
        
        console.log("Image path:", imagePath); // Debug log
        const requestUrl = `/api/png-download/${imagePath}`;
        console.log("Making request to:", requestUrl); // Debug log
        
        // Use the PNG endpoint to get a PNG version of the image
        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Accept': 'image/png'
          }
        });
        
        if (!response.ok) {
          console.log("Response not OK:", response.status, response.statusText); // Debug log
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log("Got blob:", blob.type, blob.size, "bytes"); // Debug log
        
        const item = new ClipboardItem({ 'image/png': blob });
        console.log("Created ClipboardItem"); // Debug log
        
        try {
          await navigator.clipboard.write([item]);
          console.log("Successfully wrote to clipboard"); // Debug log
          
          appContext.createNotification({
            message: appContext.t('notifications.imageCopied'),
            type: "success"
          });
        } catch (clipboardError) {
          console.error("Clipboard write failed:", clipboardError); // Detailed error
          throw clipboardError; // Re-throw to trigger fallback
        }
      } catch (error) {
        console.error("Primary clipboard operation failed:", error); // Detailed error
        
        // Always use PNG fallback since it has the best compatibility
        try {
          console.log("Attempting fallback conversion"); // Debug log
          // Construct the image path correctly for fallback - preserve the exact path
          const imagePath = data.path
            ? `${data.path}/${selectedItem.file_name}`
            : selectedItem.file_name;
          
          // Use the PNG endpoint for the fallback as well
          const response = await fetch(`/api/png-download/${imagePath}`, {
            method: 'GET',
            headers: {
              'Accept': 'image/png'
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          
          // Create an image element to draw to canvas
          const img = new Image();
          const objectUrl = URL.createObjectURL(blob);
          img.src = objectUrl;
          
          try {
            await new Promise<void>((resolve, reject) => {
              img.onload = () => {
                console.log("Image loaded in fallback, dimensions:", img.naturalWidth, "x", img.naturalHeight); // Debug log
                resolve();
              };
              img.onerror = (e) => reject(new Error('Failed to load image: ' + e.toString()));
            });
            
            // Create canvas and convert to PNG
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Failed to get canvas context');
            
            ctx.drawImage(img, 0, 0);
            console.log("Drew image to canvas"); // Debug log
            
            // Convert to PNG blob and copy to clipboard
            const pngBlob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob(blob => {
                if (blob) {
                  console.log("Created PNG blob:", blob.size, "bytes"); // Debug log
                  resolve(blob);
                }
                else reject(new Error('Failed to convert to PNG'));
              }, 'image/png');
            });

            // Try clipboard.write - if not available, throw error
            if (navigator.clipboard?.write) {
              try {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': pngBlob })
                ]);
                console.log("Successfully wrote to clipboard using fallback"); // Debug log
              } catch (clipboardWriteError) {
                console.error("Fallback clipboard write failed:", clipboardWriteError); // Detailed error
                throw clipboardWriteError;
              }
            } else {
              throw new Error('Clipboard write API not available');
            }
            
            appContext.createNotification({
              message: appContext.t('notifications.imageCopied'),
              type: "success"
            });
          } finally {
            // Clean up the object URL
            URL.revokeObjectURL(objectUrl);
          }
        } catch (fallbackError) {
          console.error("Fallback conversion failed:", fallbackError);
          appContext.createNotification({
            message: appContext.t('notifications.imageCopyFailed'),
            type: "error"
          });
        }
      }
      return;
    } else {
      return;
    }
    event.preventDefault();
  };

  // Add keyup handler to reset shift selection when shift is released
  const keyUpHandler = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setShiftSelectionStart(null);
    }
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
    window.addEventListener("keyup", keyUpHandler);
    const gallery = document.getElementById('gallery');
    if (gallery) {
      scrollManager.init(gallery);
      gallery.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    startPositionChecking(); // Start the position checking
    
    onCleanup(() => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
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

  const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB per file
  const MAX_REQUEST_SIZE = 500 * 1024 * 1024; // 500MB total request size

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
      appContext.notify({
        message: appContext.t('gallery.processingFiles'),
        type: "info"
      });
      
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
        return;
      }

      // Check individual file sizes and total size
      const oversizedFiles = files.filter(file => file.size > MAX_UPLOAD_SIZE);
      if (oversizedFiles.length > 0) {
        const maxSizeMB = MAX_UPLOAD_SIZE / (1024 * 1024);
        appContext.notify({
          message: appContext.t('gallery.fileTooLarge', { 
            count: oversizedFiles.length,
            maxSize: maxSizeMB,
            files: oversizedFiles.map(f => f.name).join(', ')
          }),
          type: "error"
        });
        return;
      }

      // Check total request size
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > MAX_REQUEST_SIZE) {
        const maxRequestSizeMB = MAX_REQUEST_SIZE / (1024 * 1024);
        appContext.notify({
          message: appContext.t('gallery.requestTooLarge', {
            totalSize: (totalSize / (1024 * 1024)).toFixed(1),
            maxSize: maxRequestSizeMB
          }),
          type: "error"
        });
        return;
      }

      // Update initial progress
      setProgressInfo({
        current: 0,
        total: totalSize,
        type: 'upload',
        message: appContext.t('gallery.uploadProgress', { count: files.length })
      });

      // Add all collected files to formData
      files.forEach(file => {
        const relativePath = file.webkitRelativePath || file.name;
        formData.append('files', file, relativePath);
      });

      const currentPath = gallery.data()?.path || '';
      const uploadUrl = currentPath 
        ? `/api/upload/${currentPath}`
        : '/api/upload';
      
      // Show upload notification
      appContext.notify({
        message: appContext.t('gallery.uploadProgress', { count: files.length }),
        type: "info"
      });

      try {
        await uploadFiles(formData, uploadUrl);
        
        // Clear progress on success
        setProgressInfo(null);
        
        // Show success notification
        appContext.notify({
          message: appContext.t('gallery.uploadSuccess', { count: files.length }),
          type: "success"
        });
        
        // Clear any existing selection to avoid index mismatches
        gallery.selection.clearMultiSelect();
        gallery.selection.clearFolderMultiSelect();
        gallery.select(null);
        
        // Force a complete refresh of the gallery data
        gallery.invalidate();
        await gallery.refetch();
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError instanceof Error) {
          if (uploadError.message.includes('413')) {
            const isRequestTooLarge = totalSize > MAX_REQUEST_SIZE;
            appContext.notify({
              message: appContext.t(
                isRequestTooLarge ? 'gallery.requestTooLarge' : 'gallery.fileTooLarge',
                isRequestTooLarge 
                  ? {
                      totalSize: (totalSize / (1024 * 1024)).toFixed(1),
                      maxSize: MAX_REQUEST_SIZE / (1024 * 1024)
                    }
                  : {
                      count: 1,
                      maxSize: MAX_UPLOAD_SIZE / (1024 * 1024)
                    }
              ),
              type: "error"
            });
          } else {
            appContext.notify({
              message: appContext.t('gallery.uploadError'),
              type: "error"
            });
          }
        }
        setProgressInfo(null);
      }
      
    } catch (error) {
      console.error('Error processing files:', error);
      appContext.notify({
        message: appContext.t('gallery.uploadError'),
        type: "error"
      });
      setProgressInfo(null);
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

  const { data } = useGallery();
  const app = useAppContext();

  createEffect(() => {
    const currentData = data();
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
          <ImageModal
            imageInfo={image()}
            captions={image().captions}
            onClose={() => gallery.setMode("view")}
            generateTags={gallery.generateTags}
            saveCaption={gallery.saveCaption}
            deleteCaption={gallery.deleteCaption}
            deleteImageAction={gallery.deleteImage}
          />
        )}
      </Show>
      <Show when={showQuickJump()}>
        <QuickJump onClose={() => setShowQuickJump(false)} />
      </Show>

      <Show when={showDeleteConfirm()}>
        <DeleteConfirmDialog
          imageCount={gallery.selection.multiSelected.size}
          folderCount={gallery.selection.multiFolderSelected.size}
          onConfirm={async () => {
            const data = gallery.data();
            if (!data) return;
            
            // Handle folder deletions first
            const selectedFolders = Array.from(gallery.selection.multiFolderSelected);
            if (selectedFolders.length > 0) {
              const folderResults = await Promise.allSettled(
                selectedFolders.map(async (idx) => {
                  const item = data.items[idx];
                  if (item?.type !== 'directory') return;
                  
                  const folderPath = data.path
                    ? `${data.path}/${item.file_name}`
                    : item.file_name;
                    
                  const params = new URLSearchParams();
                  params.append("confirm", "true");
                  
                  return await fetch(`/api/browse/${folderPath}?${params.toString()}`, {
                    method: 'DELETE',
                  });
                })
              );

              const failedFolders = folderResults.filter(r => r.status === 'rejected').length;
              if (failedFolders > 0) {
                appContext.createNotification({
                  message: appContext.t('gallery.folderDeleteError'),
                  type: "error"
                });
              }
            }

            // Handle image deletions
            const selectedImages = Array.from(gallery.selection.multiSelected);
            if (selectedImages.length > 0) {
              const results = await Promise.allSettled(
                selectedImages.map(async (idx) => {
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

                  return await fetch(`/api/browse/${imagePath}?${params.toString()}`, {
                    method: "DELETE",
                  });
                })
              );

              const failedCount = results.filter(r => r.status === 'rejected').length;
              if (failedCount > 0) {
                appContext.createNotification({
                  message: appContext.t('gallery.fileDeleteError'),
                  type: "error"
                });
              }
            }

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

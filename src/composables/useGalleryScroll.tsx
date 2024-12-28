/**
 * A composable that manages smooth scrolling behavior for the gallery, particularly
 * for keeping selected items in view.
 * 
 * @description
 * This composable provides functionality to manage smooth scrolling behavior in the gallery.
 * It enables seamless scrolling to selected items while ensuring they remain within the visible
 * viewport. It also handles mouse wheel events for image navigation.
 * 
 * The composable handles automatic position checking and correction to maintain proper item visibility.
 * Additionally, it manages scroll animations with debouncing to provide a smooth user experience.
 * 
 * @example
 * ```tsx
 * function GalleryComponent() {
 *   const { scrollToSelected, startPositionChecking } = useGalleryScroll();
 * 
 *   // Start monitoring selected item's position
 *   onMount(() => {
 *     startPositionChecking();
 *   });
 * 
 *   // Scroll to an item when selected
 *   const onItemSelect = () => {
 *     scrollToSelected();
 *   };
 * 
 *   return <div>...</div>;
 * }
 * ```
 * 
 * @returns {Object} An object containing the following functions and signals:
 * - `scrollToSelected(forceScroll?: boolean)`: Scrolls to the currently selected item. 
 *   Set forceScroll to true to bypass checks and force the scroll.
 * - `smoothScroll(targetY: number, forceScroll?: boolean)`: Smoothly scrolls to a specific Y position.
 * - `startPositionChecking()`: Begins monitoring the selected item's position in viewport.
 * - `autoScrolling(): boolean`: Signal indicating if an automatic scroll is in progress.
 * - `checkingPosition(): boolean`: Signal indicating if position verification is in progress.
 * - `setupWheelHandler()`: Sets up the wheel event handler for image navigation.
 * 
 * @remarks
 * - Maintains a 15% margin buffer zone at top and bottom of viewport
 * - Keeps selected items comfortably visible away from edges
 * - Performs position checking every 500ms when enabled
 * - Verifies and corrects item positions during scroll animations
 * - Automatically cleans up position checking intervals on unmount
 * - Uses wheel events for image navigation instead of page scrolling
 */

import { createSignal, onCleanup } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useScrollManager } from '../components/Gallery/ScrollManager';

export function useGalleryScroll() {
  const gallery = useGallery();
  const [autoScrolling, setAutoScrolling] = createSignal(false);
  const [checkingPosition, setCheckingPosition] = createSignal(false);
  let positionCheckInterval: number | null = null;
  let wheelHandler: ((e: WheelEvent) => void) | null = null;
  
  const scrollManager = useScrollManager(200);

  const smoothScroll = (targetY: number, forceScroll = false) => {
    scrollManager.smoothScrollTo(targetY, forceScroll);
  };

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
      }, 200 + 50);
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
          setTimeout(() => setCheckingPosition(false), 200);
        });
      }
    }, 500); // Check every 500ms
  };

  const setupWheelHandler = () => {
    if (wheelHandler) return;

    wheelHandler = (e: WheelEvent) => {
      // Only handle wheel events when no modifiers are pressed
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      e.preventDefault();
      
      // Detect if the event is from a touchpad
      // Touchpad events typically have smaller deltaY values and deltaMode of 0 (pixels)
      const isTouchpad = Math.abs(e.deltaY) < 50 && e.deltaMode === 0;
      
      // Dynamic scaling for touchpad - less dampening for fast scrolls
      const scaleFactor = isTouchpad 
        ? Math.abs(e.deltaY) > 30 ? 0.75 : 0.5  // Higher scale factor for fast scrolls
        : 1;
      const delta = e.deltaY * scaleFactor;
      const data = gallery.data();
      if (!data) return;

      const currentIdx = gallery.selected ?? -1;
      const totalItems = data.items.length;

      // Accumulate delta for touchpad to require more scrolling for image change
      if (isTouchpad) {
        touchpadDelta = (touchpadDelta || 0) + delta;
        // Adjust threshold based on scroll speed
        const threshold = Math.abs(e.deltaY) > 30 ? 25 : 35;
        if (Math.abs(touchpadDelta) < threshold) return;
        
        if (touchpadDelta > 0 && currentIdx < totalItems - 1) {
          // Scroll down - move to next image
          gallery.select(currentIdx + 1);
          touchpadDelta = 0;
        } else if (touchpadDelta < 0 && currentIdx > 0) {
          // Scroll up - move to previous image
          gallery.select(currentIdx - 1);
          touchpadDelta = 0;
        }
      } else {
        // Regular mouse wheel behavior
        if (delta > 0 && currentIdx < totalItems - 1) {
          // Scroll down - move to next image
          gallery.select(currentIdx + 1);
        } else if (delta < 0 && currentIdx > 0) {
          // Scroll up - move to previous image
          gallery.select(currentIdx - 1);
        }
      }
    };

    const galleryElement = document.getElementById('gallery');
    if (galleryElement) {
      galleryElement.addEventListener('wheel', wheelHandler, { passive: false });
    }
  };

  // Add touchpad delta tracking
  let touchpadDelta = 0;

  onCleanup(() => {
    if (positionCheckInterval) {
      clearInterval(positionCheckInterval);
      positionCheckInterval = null;
    }
    if (wheelHandler) {
      const galleryElement = document.getElementById('gallery');
      if (galleryElement) {
        galleryElement.removeEventListener('wheel', wheelHandler);
      }
      wheelHandler = null;
    }
  });

  return {
    scrollToSelected,
    smoothScroll,
    startPositionChecking,
    autoScrolling,
    checkingPosition,
    setupWheelHandler
  };
}

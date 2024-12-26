/**
 * A composable that manages smooth scrolling behavior for the gallery, particularly
 * for keeping selected items in view.
 * 
 * @description
 * This composable provides functionality to manage smooth scrolling behavior in the gallery.
 * It enables seamless scrolling to selected items while ensuring they remain within the visible
 * viewport.
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
 * 
 * @remarks
 * - Maintains a 15% margin buffer zone at top and bottom of viewport
 * - Keeps selected items comfortably visible away from edges
 * - Performs position checking every 500ms when enabled
 * - Verifies and corrects item positions during scroll animations
 * - Automatically cleans up position checking intervals on unmount
 */

import { createSignal, onCleanup } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useScrollManager } from '../components/Gallery/ScrollManager';

export function useGalleryScroll() {
  const gallery = useGallery();
  const [autoScrolling, setAutoScrolling] = createSignal(false);
  const [checkingPosition, setCheckingPosition] = createSignal(false);
  let positionCheckInterval: number | null = null;
  
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

  onCleanup(() => {
    if (positionCheckInterval) {
      clearInterval(positionCheckInterval);
      positionCheckInterval = null;
    }
  });

  return {
    scrollToSelected,
    smoothScroll,
    startPositionChecking,
    autoScrolling,
    checkingPosition
  };
}

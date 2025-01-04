/**
 * A composable that manages side effects for the gallery component, including scroll behavior,
 * document title updates, and thumbnail size change handling.
 * 
 * This composable handles four main responsibilities:
 * 1. Position checking initialization for gallery items
 * 2. Automatic scrolling to selected items in the gallery
 * 3. Dynamic document title updates based on current gallery path
 * 4. Thumbnail size change event handling
 * 
 * @param props.scrollToSelected - Function to scroll the gallery to the currently selected item
 *                                Takes an optional forceScroll parameter to override scroll behavior
 * @param props.autoScrolling - Function that returns whether automatic scrolling is currently active
 * @param props.startPositionChecking - Function to initialize position checking for gallery items
 * 
 * @example
 * ```tsx
 * const galleryEffects = useGalleryEffects({
 *   scrollToSelected: (force) => scrollIntoView(selectedRef, force),
 *   autoScrolling: () => isAutoScrolling(),
 *   startPositionChecking: () => initPositionCheck()
 * });
 * ```
 * 
 * The composable sets up several effects:
 * - Initializes position checking on mount
 * - Handles scrolling to selected items when selection changes
 * - Updates the document title based on the current gallery path
 * - Manages thumbnail size change events and triggers gallery refetch
 */

import { createEffect, onCleanup } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";

interface UseGalleryEffectsProps {
  scrollToSelected: (forceScroll?: boolean) => void;
  autoScrolling: () => boolean;
  startPositionChecking: () => void;
}

export function useGalleryEffects({ 
  scrollToSelected, 
  autoScrolling,
  startPositionChecking 
}: UseGalleryEffectsProps) {
  const gallery = useGallery();

  // Initialize position checking
  createEffect(() => {
    startPositionChecking();
  });

  // Handle selection changes
  createEffect(() => {
    const selected = gallery.selected;
    const mode = gallery.mode;
    if (selected !== null && !autoScrolling()) {
      let frame: number | undefined;
      frame = requestAnimationFrame(() => {
        scrollToSelected(true);
      });
      onCleanup(() => {
        if (frame) {
          cancelAnimationFrame(frame);
        }
      });
    }
  });

  // Update document title
  createEffect(() => {
    const currentData = gallery.data();
    if (currentData) {
      const path = currentData.path.split("/").filter(Boolean);
      const title = path.length > 0 
        ? `${path.join(" / ")} - ~yipyap` 
        : "Gallery - ~yipyap";
      document.title = title;
    }
  });

  // Handle thumbnail size changes
  createEffect(() => {
    const handleThumbnailSizeChange = () => {
      gallery.refetchGallery();
    };
    
    window.addEventListener('thumbnailSizeChanged', handleThumbnailSizeChange);
    onCleanup(() => {
      window.removeEventListener('thumbnailSizeChanged', handleThumbnailSizeChange);
    });
  });
}

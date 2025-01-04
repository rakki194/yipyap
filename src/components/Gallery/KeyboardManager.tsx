import { onCleanup, createSignal } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useNavigate } from "@solidjs/router";
import { useGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";

export interface KeyboardHandlerProps {
  onShowQuickJump: () => void;
  onShowSettings: () => void;
  onShowDeleteConfirm: () => void;
  onShowNewFolderDialog: () => void;
  scrollToSelected: (force?: boolean) => void;
  smoothScroll: (targetY: number, force?: boolean) => void;
  isSettingsOpen: boolean;
  isQuickJumpOpen: boolean;
}

export const useKeyboardManager = ({
  onShowQuickJump,
  onShowDeleteConfirm,
  scrollToSelected,
  smoothScroll,
}: KeyboardHandlerProps) => {
  const navigate = useNavigate();
  const gallery = useGallery();
  const { state: keyboardState } = useGlobalEscapeManager();
  const [shiftSelectionStart, setShiftSelectionStart] = createSignal<number | null>(null);
  const [preventAutoScroll, setPreventAutoScroll] = createSignal(false);

  const keyDownHandler = async (event: KeyboardEvent) => {
    // Check global keyboard state
    const state = keyboardState();
    if (state.modalOpen || state.settingsOpen || state.quickJumpOpen) return;

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
        
        scrollToSelected();
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
    } else if (event.key === "Enter" || (event.key === " " && !event.shiftKey)) {
      // Don't intercept if no selection and in root directory
      if (gallery.selected === null && data.path === "") return;

      const selImageItem =
        gallery.selected !== null
          ? data.items[gallery.selected]
          : { type: "directory", file_name: ".." };
      if (selImageItem.type === "directory") {
        navigate(`/${data.path ? `${data.path}/` : ''}${selImageItem.file_name}`);
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
      navigate(`/${segments.slice(0, -1).join("/")}`);
    } else if (event.key === "Delete") {
      if (gallery.selection.multiSelected.size > 0 || gallery.selection.multiFolderSelected.size > 0) {
        event.preventDefault();
        onShowDeleteConfirm();
      }
    } else if (event.key === "q") {
      onShowQuickJump();
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
    } else if (event.key === "Home") {
      event.preventDefault();
      const galleryElement = document.getElementById('gallery');
      if (!galleryElement) return;

      //console.debug('Home key pressed:', {
      //  path: data.path,
      //  scrollHeight: galleryElement.scrollHeight,
      //  clientHeight: galleryElement.clientHeight,
      //  scrollTop: galleryElement.scrollTop
      //});

      // Set flag to prevent auto-scroll
      setPreventAutoScroll(true);

      // Then handle selection
      if (data.path) {
        //console.debug('Selecting parent directory (null)');
        gallery.selection.select(null);
        // Force scroll to top by scrolling the first item into view
        const firstItem = galleryElement.querySelector('.responsive-grid .item');
        if (firstItem) {
          firstItem.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      } else {
        const firstItemIndex = data.items.findIndex(item => item.type === "image" || item.type === "directory");
        //console.debug('Selecting first item:', {
        //  firstItemIndex,
        //  itemType: firstItemIndex !== -1 ? data.items[firstItemIndex].type : 'none'
        //});
        if (firstItemIndex !== -1) {
          gallery.selection.select(firstItemIndex);
          // Force scroll to top by scrolling the first item into view
          const firstItem = galleryElement.querySelector('.responsive-grid .item');
          if (firstItem) {
            firstItem.scrollIntoView({ block: 'start', behavior: 'instant' });
          }
        }
      }

      // Reset flag after a short delay
      setTimeout(() => setPreventAutoScroll(false), 100);
    } else if (event.key === "End") {
      event.preventDefault();
      const lastItemIndex = data.items.length - 1;
      if (lastItemIndex >= 0) {
        const galleryElement = document.getElementById('gallery');
        if (galleryElement) {
          // For last item, select first then scroll
          gallery.selection.select(lastItemIndex);
          const targetY = galleryElement.scrollHeight - galleryElement.clientHeight;
          smoothScroll(targetY, true);
        }
      }
    } else {
      return;
    }
    event.preventDefault();
  };

  const keyUpHandler = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setShiftSelectionStart(null);
    }
  };

  // Add event listeners
  window.addEventListener("keydown", keyDownHandler);
  window.addEventListener("keyup", keyUpHandler);

  onCleanup(() => {
    window.removeEventListener("keydown", keyDownHandler);
    window.removeEventListener("keyup", keyUpHandler);
  });

  // Modify scrollToSelected to respect the flag
  const originalScrollToSelected = scrollToSelected;
  const wrappedScrollToSelected = (force?: boolean) => {
    if (preventAutoScroll()) return;
    originalScrollToSelected(force);
  };

  return {
    shiftSelectionStart,
    setShiftSelectionStart,
    scrollToSelected: wrappedScrollToSelected
  };
}; 

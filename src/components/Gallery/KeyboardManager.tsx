import { onCleanup, createSignal } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";
import { useNavigate } from "@solidjs/router";

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
  onShowSettings,
  onShowDeleteConfirm,
  onShowNewFolderDialog,
  scrollToSelected,
  smoothScroll,
  isSettingsOpen,
  isQuickJumpOpen
}: KeyboardHandlerProps) => {
  const navigate = useNavigate();
  const gallery = useGallery();
  const appContext = useAppContext();
  const [shiftSelectionStart, setShiftSelectionStart] = createSignal<number | null>(null);

  const keyDownHandler = async (event: KeyboardEvent) => {
    // Don't handle keyboard events when settings or quickjump is open
    if (isSettingsOpen || isQuickJumpOpen) return;

    // Returns when we don't act on the event, preventDefault for acted-upon event
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

  return {
    shiftSelectionStart,
    setShiftSelectionStart,
  };
}; 
import { Resource, createEffect, on } from "solid-js";
import { createStaticStore } from "@solid-primitives/static-store";
import { BrowsePagesCached } from "~/resources/browse";

/**
 * Selection state type representing either view or edit mode
 */
export type Mode = "view" | "edit";

/**
 * Type alias for the return value of useSelection hook
 */
export type Selection = ReturnType<typeof useSelection>;

/**
 * Creates a selection manager for browsing and editing images in a grid layout.
 * This hook manages the current selection state, edit/view mode, and grid navigation.
 * 
 * Features:
 * - Single and multi-selection support for images and folders
 * - Grid-based navigation (up/down/left/right)
 * - View/Edit mode switching
 * - Column-aware grid navigation
 * 
 * @param backendData - Resource containing the cached browse pages data
 * @returns An object containing selection state and methods to manipulate it
 */
export function useSelection(backendData: Resource<BrowsePagesCached>) {
  // Initialize with empty state first
  const [state, setState] = createStaticStore<{
    selected: number | null;
    multiSelected: Set<number>;
    multiFolderSelected: Set<number>;
    mode: Mode;
    columns: number | null;
    path: string;
  }>({
    selected: null,
    multiSelected: new Set(),
    multiFolderSelected: new Set(),
    mode: "view",
    columns: null,
    path: '',
  });

  // Save state to localStorage whenever it changes
  const saveState = () => {
    const currentData = backendData();
    if (!currentData) return;

    const stateToSave = {
      selected: state.selected,
      multiSelected: Array.from(state.multiSelected),
      multiFolderSelected: Array.from(state.multiFolderSelected),
      mode: state.mode,
      columns: state.columns,
      path: currentData.path || '',
    };
    localStorage.setItem('gallerySelection', JSON.stringify(stateToSave));
  };

  // Effect to restore saved state when backendData loads
  createEffect(
    on(
      () => backendData(),
      (currentData) => {
        if (!currentData) return;

        const savedState = localStorage.getItem('gallerySelection');
        if (!savedState) return;

        const parsed = JSON.parse(savedState);
        // Only restore state if the path matches
        if (parsed.path === currentData.path) {
          setState(prev => ({
            ...prev,
            selected: parsed.selected,
            multiSelected: new Set(parsed.multiSelected),
            multiFolderSelected: new Set(parsed.multiFolderSelected),
            mode: parsed.mode,
            columns: parsed.columns,
            path: parsed.path,
          }));
        } else {
          // Clear selections when path doesn't match
          setState(prev => ({
            ...prev,
            selected: null,
            multiSelected: new Set(),
            multiFolderSelected: new Set(),
            mode: "view",
            path: currentData.path || '',
          }));
          saveState();
        }
      }
    )
  );

  /**
   * Scrolls to the selected item smoothly
   */
  const scrollToSelected = (idx: number) => {
    const item = document.querySelector(`#gallery .responsive-grid .item:nth-child(${idx + 1})`);
    if (item) {
      item.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
  };

  /**
   * Selects items by page (PageUp/PageDown)
   */
  const selectPage = (direction: "up" | "down") => {
    const data = backendData();
    if (!data) return false;

    const viewportHeight = window.innerHeight;
    const itemHeight = 250; // Approximate height of each grid item
    const itemsPerPage = Math.floor(viewportHeight / itemHeight) * (state.columns || 1);

    const currentIdx = selection.selected ?? 0;
    let newIdx: number;

    if (direction === "up") {
      newIdx = Math.max(0, currentIdx - itemsPerPage);
    } else {
      newIdx = Math.min(data.items.length - 1, currentIdx + itemsPerPage);
    }

    const success = selection.select(newIdx);
    if (success) {
      scrollToSelected(newIdx);
    }
    return success;
  };

  const selection = {
    /**
     * Selects an image by index
     * @param idx - The index to select, "last" for last item, or null to clear selection
     * @returns true if selection was successful, false otherwise
     */
    select: (idx: number | "last" | null) => {
      const data = backendData();
      // Return false if no data
      if (!data?.items.length) {
        setState("selected", null);
        return false;
      }
      const l = data.items.length;
      // Handle special cases:
      if (idx === null) {
        // When selecting null (parent directory), always allow it and set view mode
        setState({ selected: null, mode: "view" });
        return true;
      } else if (idx === "last" || idx >= l) {
        // "last" or overflow - select last item
        idx = l - 1;
      } else if (idx < 0) {
        // Negative index means deselect or select the parent directory item (..)
        // This happens when navigating up from first item
        setState({ selected: null, mode: "view" });
        return true;
      }
      let changed = false;
      setState((prev) => {
        const mode = data.items[idx].type !== "image" ? "view" : prev.mode;
        if (prev.selected === idx && prev.mode === mode) return prev;
        changed = true;
        return { selected: idx, mode };
      });
      return changed;
    },
    /**
     * Gets the currently selected image, if any
     * @returns The selected ImageItem or null if no image is selected
     */
    get selectedImage() {
      const data = backendData();
      if (!data || selection.selected === null) return null;
      const image = data.items[selection.selected];
      return image && image.type === "image" ? image : null;
    },
    /**
     * Selects the previous image in the list
     * @returns true if selection was successful
     */
    selectPrev: () => {
      return selection.select(
        selection.selected !== null ? selection.selected - 1 : "last"
      );
    },
    /**
     * Selects the next image in the list
     * @returns true if selection was successful
     */
    selectNext: () => {
      return selection.select(
        selection.selected !== null ? selection.selected + 1 : 0
      );
    },
    /**
     * Moves selection down by one row in the grid
     * @returns true if selection was successful
     */
    selectDown: () => {
      const columns = state.columns;
      const index = selection.selected;
      if (index === null) return selection.select(0);
      if (columns === null) return false;
      return selection.select(index + columns);
    },
    /**
     * Moves selection up by one row in the grid
     * @returns true if selection was successful
     */
    selectUp: () => {
      const columns = state.columns;
      const index = selection.selected;
      if (index === null) return selection.select("last");
      if (columns === null) return false;
      return selection.select(index - columns);
    },
    /**
     * Gets the currently edited image data if in edit mode
     * @returns The edited ImageData or null if not in edit mode
     */
    get editedImage() {
      if (selection.mode !== "edit") return null;
      const item = selection.selectedImage;
      return item ? item() || null : null;
    },
    /**
     * Toggles between edit and view modes
     * @returns true if mode change was successful
     */
    toggleEdit: () => {
      return selection.setMode(selection.mode === "edit" ? "view" : "edit");
    },
    /**
     * Gets the current mode (view/edit)
     */
    get mode() {
      return state.mode;
    },
    /**
     * Sets the current mode
     */
    set mode(newMode: Mode) {
      selection.setMode(newMode);
    },
    /**
     * Selects an image and enters edit mode
     * @param idx - The index of the image to edit
     * @returns true if entering edit mode was successful
     */
    edit: (idx: number) => {
      selection.select(idx);
      return selection.setMode("edit");
    },
    /**
     * Sets the current mode
     * @param mode - The mode to set (view/edit)
     * @returns true if mode change was successful
     */
    setMode: (mode: Mode) => {
      if (mode === "edit") {
        if (selection.selectedImage !== null) {
          setState("mode", "edit");
          return true;
        } else {
          return false;
        }
      } else {
        setState("mode", mode);
        return true;
      }
    },
    /**
     * Gets the currently selected index
     */
    get selected() {
      return state.selected;
    },
    /**
     * Sets the number of columns in the grid layout
     * @param columns - Number of columns or null to clear
     */
    setColumns: (columns: number | null) => {
      setState("columns", columns);
    },
    /**
     * Gets the set of multi-selected indices
     */
    get multiSelected() {
      return state.multiSelected;
    },
    /**
     * Toggles selection for a specific index
     */
    toggleMultiSelect: (idx: number) => {
      const data = backendData();
      if (!data?.items[idx]) return;

      const item = data.items[idx];
      if (item.type === "image") {
        setState((prev) => {
          const newSet = new Set(prev.multiSelected);
          if (newSet.has(idx)) {
            newSet.delete(idx);
          } else {
            newSet.add(idx);
          }
          return { multiSelected: newSet };
        });
        saveState(); // Save after toggling
      } else if (item.type === "directory") {
        setState((prev) => {
          const newSet = new Set(prev.multiFolderSelected);
          if (newSet.has(idx)) {
            newSet.delete(idx);
          } else {
            newSet.add(idx);
          }
          return { multiFolderSelected: newSet };
        });
        saveState(); // Save after toggling
      }
    },
    /**
     * Selects all items of specified type in the current view
     */
    selectAll: () => {
      const data = backendData();
      if (!data?.items.length) return;

      setState(prev => {
        const newMultiSelected = new Set<number>();
        const newMultiFolderSelected = new Set<number>();

        data.items.forEach((item, idx) => {
          if (item.type === "image") {
            newMultiSelected.add(idx);
          } else if (item.type === "directory" && item.file_name !== "..") {
            newMultiFolderSelected.add(idx);
          }
        });

        return {
          ...prev,
          multiSelected: newMultiSelected,
          multiFolderSelected: newMultiFolderSelected,
        };
      });
      saveState();
    },
    /**
     * Clears all multi-selections (both images and folders)
     */
    clearMultiSelect: () => {
      setState(prev => ({
        ...prev,
        multiSelected: new Set(),
        multiFolderSelected: new Set(),
      }));
      saveState();
    },
    /**
     * Gets the set of multi-selected folder indices
     */
    get multiFolderSelected() {
      return state.multiFolderSelected;
    },
    /**
     * Toggles selection for a specific folder index
     */
    toggleFolderMultiSelect: (idx: number) => {
      setState(prev => {
        const newSet = new Set(prev.multiFolderSelected);
        if (newSet.has(idx)) {
          newSet.delete(idx);
        } else {
          newSet.add(idx);
        }
        return { multiFolderSelected: newSet };
      });
      saveState(); // Add save after folder toggle
    },
    /**
     * Selects all folders in the current view
     */
    selectAllFolders: () => {
      const data = backendData();
      if (!data?.items.length) return;

      setState(prev => {
        const newSet = new Set<number>();
        data.items.forEach((item, idx) => {
          if (item.type === "directory") {
            newSet.add(idx);
          }
        });
        return { multiFolderSelected: newSet, multiSelected: new Set() };
      });
      saveState(); // Add save after selecting all folders
    },
    /**
     * Clears all folder multi-selections
     */
    clearFolderMultiSelect: () => {
      setState(prev => ({
        ...prev,
        multiFolderSelected: new Set(),
      }));
      saveState(); // Save after clearing
    },
    /**
     * Selects the previous page of items
     * @returns true if selection was successful
     */
    selectPageUp: () => {
      return selectPage("up");
    },
    /**
     * Selects the next page of items
     * @returns true if selection was successful
     */
    selectPageDown: () => {
      return selectPage("down");
    },
  };

  return selection;
}

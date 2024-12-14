import { Resource } from "solid-js";
import { createStaticStore } from "@solid-primitives/static-store";
import { BrowsePagesCached } from "~/resources/browse";

export type Mode = "view" | "edit";
export type Selection = ReturnType<typeof useSelection>;

/**
 * Creates a selection manager for browsing and editing images in a grid layout.
 * This hook manages the current selection state, edit/view mode, and grid navigation.
 *
 * @param backendData - Resource containing the cached browse pages data
 * @returns An object containing selection state and methods to manipulate it
 */
export function useSelection(backendData: Resource<BrowsePagesCached>) {
  const [state, setState] = createStaticStore<{
    selected: number | null;
    multiSelected: Set<number>;
    mode: "view" | "edit";
    columns: number | null;
  }>({
    selected: null,
    multiSelected: new Set(),
    mode: "view",
    columns: null,
  });

  const selection = {
    /**
     * Selects an image by index
     * @param idx - The index to select, "last" for last item, or null to clear selection
     * @returns true if selection was successful, false otherwise
     */
    select: (idx: number | "last" | null) => {
      const data = backendData();
      // Return false if no data or explicitly selecting null
      if (!data?.items.length) {
        setState("selected", null);
        return false;
      }
      const l = data.items.length;
      // Handle special cases:
      if (idx === null) {
        idx = null;
      } else if (idx === "last" || idx >= l) {
        // "last" or overflow - select last item
        idx = l - 1;
      } else if (idx < 0) {
        // Negative index means deselect or select the parent directory item (..)
        // This happens when navigating up from first item
        idx = null;
      }
      let changed = false;
      setState((prev) => {
        const mode = idx === null || data.items[idx].type !== "image" ? "view" : prev.mode;
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
      setState(prev => {
        const newSet = new Set(prev.multiSelected);
        if (newSet.has(idx)) {
          newSet.delete(idx);
        } else {
          newSet.add(idx);
        }
        return { ...prev, multiSelected: newSet };
      });
    },
    /**
     * Selects all images in the current view
     */
    selectAll: () => {
      const data = backendData();
      if (!data?.items.length) return;
      
      setState(prev => {
        const newSet = new Set<number>();
        data.items.forEach((item, idx) => {
          if (item.type === "image") {
            newSet.add(idx);
          }
        });
        return { ...prev, multiSelected: newSet };
      });
    },
    /**
     * Clears all multi-selections
     */
    clearMultiSelect: () => {
      setState(prev => ({ ...prev, multiSelected: new Set() }));
    },
  };

  return selection;
}

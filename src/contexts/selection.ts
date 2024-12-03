import { Resource } from "solid-js";
import { createStaticStore } from "@solid-primitives/static-store";
import { BrowsePagesCached } from "~/resources/browse";

export type Mode = "view" | "edit";
export type Selection = ReturnType<typeof useSelection>;

export function useSelection(backendData: Resource<BrowsePagesCached>) {
  const [state, setState] = createStaticStore<{
    selected: number | null;
    mode: "view" | "edit";
    columns: number | null;
  }>({
    selected: null,
    mode: "view",
    columns: null,
  });

  const selection = {
    select: (idx: number | "last" | null) => {
      const data = backendData();
      if (!data) return false;
      if (idx === null) {
        setState({ mode: "view", selected: null });
        return true;
      }
      const l = data.items.length;
      if (l === 0) {
        return false;
      }
      if (idx === "last") {
        idx = l - 1;
      } else if (idx < 0) {
        idx = 0;
      }

      setState("selected", idx);
      return true;
    },
    get selectedImage() {
      const data = backendData();
      if (!data || selection.selected === null) return null;
      const image = data.items[selection.selected];
      return image && image.type === "image" ? image : null;
    },
    selectPrev: () => {
      return selection.select(
        selection.selected !== null ? selection.selected - 1 : "last"
      );
    },
    selectNext: () => {
      return selection.select(
        selection.selected !== null ? selection.selected + 1 : 0
      );
    },
    selectDown: () => {
      const columns = state.columns;
      const index = selection.selected;
      if (index === null) return selection.select(0);
      if (columns === null) return false;
      return selection.select(index + columns);
    },
    selectUp: () => {
      const columns = state.columns;
      const index = selection.selected;
      if (index === null) return selection.select("last");
      if (columns === null) return false;
      return selection.select(index - columns);
    },
    get editedImage() {
      if (selection.mode !== "edit") return null;
      const item = selection.selectedImage;
      return item ? item() || null : null;
    },
    toggleEdit: () => {
      return selection.setMode(selection.mode === "edit" ? "view" : "edit");
    },
    get mode() {
      return state.mode;
    },
    set mode(newMode: Mode) {
      selection.setMode(newMode);
    },
    edit: (idx: number) => {
      selection.select(idx);
      return selection.setMode("edit");
    },
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
    get selected() {
      return state.selected;
    },
    setColumns: (columns: number | null) => {
      setState("columns", columns);
    },
  };

  return selection;
}

import { InitializedResource } from "solid-js";
import { createStaticStore } from "@solid-primitives/static-store";
import { BrowsePagesCached } from "~/resources/browse";

export interface SaveCaption {
  caption: string;
  type: string;
}

export type Mode = "view" | "edit";
export type Selection = ReturnType<typeof useSelection>;

export function useSelection(
  backendData: InitializedResource<BrowsePagesCached>
) {
  const [state, setState] = createStaticStore<{
    selected: number | null;
    mode: "view" | "edit";
  }>({
    selected: null,
    mode: "view",
  });

  const selection = {
    select: (idx: number | null) => {
      if (idx === null) {
        setState("mode", "view");
        setState("selected", null);
        return true;
      } else if (idx >= 0 && idx < backendData().items.length) {
        setState("selected", idx);
        const item = backendData().items[idx];

        return true;
      } else {
        return false;
      }
    },
    get selectedImage() {
      if (selection.selected === null) return null;
      const image = backendData().items[selection.selected];
      return image && image.type === "image" ? image : null;
    },
    selectPrev: () => {
      const newIndex =
        selection.selected === null
          ? backendData().items.length - 1
          : selection.selected - 1;
      return selection.select(newIndex);
    },
    selectNext: () => {
      const newIndex = selection.selected === null ? 0 : selection.selected + 1;
      return selection.select(newIndex);
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
  };

  return selection;
}

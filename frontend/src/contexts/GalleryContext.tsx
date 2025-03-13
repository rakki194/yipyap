import type { ParentComponent } from "solid-js";
import { useContext } from "solid-js";
import { makeGalleryState } from "./gallery";
import { GalleryContext } from "./contexts";

// Re-exports all the public types from gallery.ts
export type * from "./gallery";
export { makeGalleryState } from "./gallery";

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context)
    throw new Error("useGallery must be used within a GalleryProvider");
  return context;
}

export const GalleryProvider: ParentComponent<{ children: any }> = (props) => {
  return (
    <GalleryContext.Provider value={makeGalleryState()}>
      {props.children}
    </GalleryContext.Provider>
  );
};

// import { createEffect } from 'solid-js';
// import { unwrap } from 'solid-js/store';
import { Gallery } from "~/components/Gallery/Gallery";
import { GalleryContext, makeGalleryState } from "~/contexts/GalleryContext";
import { Breadcrumb } from "~/components/Gallery/Breadcrumb";


export default function GalleryPage() {
  const state = makeGalleryState();

  return (
    <>
      <GalleryContext.Provider value={state}>
        <Breadcrumb path={state.params.path} />
        <Gallery />
      </GalleryContext.Provider>
    </>
  );
}

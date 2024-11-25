// import { createEffect } from 'solid-js';
// import { unwrap } from 'solid-js/store';
import { Gallery } from "~/components/Gallery/Gallery";
import { Breadcrumb } from "~/components/Gallery/Breadcrumb";
import { GalleryProvider } from "~/contexts/GalleryContext";
export default function GalleryPage() {
  return (
    <>
      <GalleryProvider>
        <Breadcrumb />
        <Gallery />
      </GalleryProvider>
    </>
  );
}

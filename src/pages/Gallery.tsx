// import { createEffect } from 'solid-js';
// import { unwrap } from 'solid-js/store';
import { Gallery } from "~/components/Gallery/Gallery";
import { GalleryContext, makeGalleryState } from "~/contexts/GalleryContext";
import { createGalleryRessourceCached } from "~/resources/browse";
import { Breadcrumb } from "~/components/Gallery/Breadcrumb";
import type { AnyItem } from "~/resources/browse";

export default function GalleryPage() {
  const contextState = makeGalleryState();

  // const galleryRessource = createGalleryRessource(() => ({ path: params.path || '/', page: searchParams.page ? Number(searchParams.page) : 1 }));
  const galleryRessourceCached = createGalleryRessourceCached(() => ({
    path: contextState.params.path || "/",
    page: contextState.state.page,
  }));

  // createEffect(() => {
  //   console.log('params', { page: contextState.state.page, ...contextState.params })
  // })

  // createEffect(() => {
  //   const gallery = galleryRessourceCached()
  //   console.log('gallery_ressource', unwrap(gallery))
  // })

  const getItems = () => {
    const allItems = new Map<string, AnyItem>();
    Object.entries(galleryRessourceCached()!.pages).forEach(
      ([_page, pageItems]) => {
        pageItems.forEach((item, key) => {
          allItems.set(key, item);
        });
      }
    );
    return allItems;
  };

  return (
    <>
      <GalleryContext.Provider value={contextState}>
        <Breadcrumb path={contextState.params.path} />
        <Gallery path={galleryRessourceCached()!.path} items={getItems()} />
      </GalleryContext.Provider>
    </>
  );
}

// src/pages/Gallery.tsx
//
// This file contains the main Gallery page component that displays images and navigation.

import { Gallery } from "~/components/Gallery/Gallery";
import { Breadcrumb } from "~/components/Gallery/Breadcrumb";
import { GalleryProvider } from "~/contexts/GalleryContext";

/**
 * Main Gallery page component that provides the gallery context and renders
 * the breadcrumb navigation and image gallery components.
 *
 * Uses GalleryProvider to manage shared gallery state and provide it to child components.
 * Renders a breadcrumb navigation showing current location and the main gallery grid.
 */
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

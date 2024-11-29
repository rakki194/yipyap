// src/pages/Gallery.tsx
//
// This file contains the main Gallery page component that displays images and navigation.

import { Component } from "solid-js";
import { Gallery } from "~/components/Gallery/Gallery";
import { Breadcrumb } from "~/components/Gallery/Breadcrumb";
import { GalleryProvider } from "~/contexts/GalleryContext";
import FadeIn from "~/components/FadeIn"; // Importing the FadeIn component

/**
 * Main Gallery page component that provides the gallery context and renders
 * the breadcrumb navigation and image gallery components.
 *
 * Uses GalleryProvider to manage shared gallery state and provide it to child components.
 * Renders a breadcrumb navigation showing current location and the main gallery grid.
 */
const GalleryPage: Component = () => {
  return (
    <FadeIn duration={800}>
      <GalleryProvider>
        <Breadcrumb />
        <Gallery />
      </GalleryProvider>
    </FadeIn>
  );
};

export default GalleryPage;

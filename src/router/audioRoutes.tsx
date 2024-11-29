// src/router/audioRoutes.tsx

import { Route } from "@solidjs/router";
import { lazy } from "solid-js";
import { NotFound } from "../pages/not_found";

// Lazy load audio-related components
const AudioGallery = lazy(() => import("../components/Audio/AudioGallery"));
const AudioDetail = lazy(() => import("../components/Audio/AudioDetail"));

export const AudioRoutes = () => {
  return (
    <>
      <Route path="/" component={AudioGallery} />
      <Route path="/:id" component={AudioDetail} />
      <Route path="*404" component={NotFound} />
    </>
  );
};

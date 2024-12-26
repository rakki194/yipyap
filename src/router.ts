// src/router.ts
//
// This file defines the application's routing configuration.

import { lazy } from "solid-js";
import { Navigate, RouteDefinition } from "@solidjs/router";
import { NotFound } from "./pages/not_found";

// Lazy load components for code splitting
const GalleryPage = lazy(() => import("./pages/Gallery"));
const AudioPage = lazy(() => import("./pages/Audio"));

/**
 * Application route definitions using SolidJS Router
 *
 * Defines the following routes:
 * - / - Gallery view (root)
 * - /gallery/* - Main gallery view with nested paths
 * - /audio/* - Main audio view with nested paths
 * - *404 - Catch-all route for 404 errors
 */
export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: GalleryPage,
  },
  {
    path: "/gallery/*path",
    component: GalleryPage,
  },
  {
    path: "/audio/*path",
    component: AudioPage,
  },
  {
    path: "*404",
    component: NotFound,
  },
];

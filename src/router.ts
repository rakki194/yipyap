// src/router.ts
//
// This file defines the application's routing configuration.

import { lazy } from "solid-js";
import { Navigate, RouteDefinition } from "@solidjs/router";
import { NotFound } from "./pages/not_found";

// Lazy load components for code splitting
const GalleryPage = lazy(() => import("./pages/Gallery"));

/**
 * Application route definitions using SolidJS Router
 *
 * Defines the following routes:
 * - / - Gallery view (root)
 * - /* - Main gallery view with nested paths
 * - *404 - Catch-all route for 404 errors
 */
export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: GalleryPage,
  },
  {
    path: "/*path",
    component: GalleryPage,
  },
  {
    path: "*404",
    component: NotFound,
  },
];

import { lazy } from "solid-js";
import { RouteDefinition, useParams } from "@solidjs/router";
import { NotFound } from "./pages/not_found";

export const routes: RouteDefinition[] = [
  {
    path: "/gallery/*path",
    component: lazy(() => import("./pages/Gallery")),
  },
  // {
  //   path: '/image/*path',
  //   component: lazy(() => import('./pages/ImageViewer')),
  // },
  {
    path: "/",
    component: lazy(() => import("./pages/Gallery")),
  },
  {
    path: "*404",
    component: NotFound,
  },
];

import { lazy } from "solid-js";
import { Navigate, RouteDefinition } from "@solidjs/router";
import { NotFound } from "./pages/not_found";

export const routes: RouteDefinition[] = [
  {
    path: "/gallery/*path",
    component: lazy(() => import("./pages/Gallery")),
  },
  {
    path: "/",
    component: () => Navigate({ href: "/gallery" }),
  },
  {
    path: "*404",
    component: NotFound,
  },
];

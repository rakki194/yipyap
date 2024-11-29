// src/pages/not_found.tsx
//
// Not Found page component

import type { Component } from "solid-js";
import { useParams } from "@solidjs/router";
import FadeIn from "~/components/FadeIn";

export const NotFound: Component = () => {
  const params = useParams();
  return (
    <FadeIn duration={300}>
      <div>
        <p>Not Found {params["404"] || ""}</p>
      </div>
    </FadeIn>
  );
};

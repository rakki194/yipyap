import type { Component } from "solid-js";
import { useParams } from "@solidjs/router";

export const NotFound: Component = () => {
  const params = useParams();
  return (
    <div>
      <p>Not Found {params["404"] || ""}</p>
    </div>
  );
};

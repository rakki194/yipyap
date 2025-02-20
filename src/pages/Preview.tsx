// import "./Preview.css";

import type { JSX } from "solid-js";
import { createResource, ErrorBoundary } from "solid-js";
import "./Preview.css";

export default function Preview() {
  const errorSignal = () => {
    throw new Error("Not implemented");
  };

  return (
    <>
      <div class="image-container">
        <div class="image-stack">
          <img
            class="base-image top"
            src="/preview/_/amicus/1_amicus_(adastra)/0ba82ac422ef52902cd8d50fa75f79cb.webp"
            alt="Preview Image"
            onLoad={(e) => {
              if (import.meta.env.DEV)
                console.debug("large image loaded:", {
                  naturalHeight: e.currentTarget.naturalHeight,
                  naturalWidth: e.currentTarget.naturalWidth,
                  clientHeight: e.currentTarget.clientHeight,
                  clientWidth: e.currentTarget.clientWidth,
                  containerHeight: e.currentTarget.parentElement?.clientHeight,
                  containerWidth: e.currentTarget.parentElement?.clientWidth,
                });
            }}
          />
          <img
            class="overlay-image bottom"
            src="/thumbnail/_/amicus/1_amicus_(adastra)/0ba82ac422ef52902cd8d50fa75f79cb.webp"
            alt="Thumbnail Image"
            onLoad={(e) => {
              if (import.meta.env.DEV)
                console.debug("small image loaded:", {
                  naturalHeight: e.currentTarget.naturalHeight,
                  naturalWidth: e.currentTarget.naturalWidth,
                  clientHeight: e.currentTarget.clientHeight,
                  clientWidth: e.currentTarget.clientWidth,
                  containerHeight: e.currentTarget.parentElement?.clientHeight,
                  containerWidth: e.currentTarget.parentElement?.clientWidth,
                });
            }}
          />
        </div>
        <div class="ui">
          <h1>UI Content</h1>
          <p>
            This is the UI section that will maintain a minimum width of 100px.
          </p>
        </div>
      </div>

      <style></style>
    </>
  );
}

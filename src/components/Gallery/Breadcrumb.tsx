import { For } from "solid-js";
import { A } from "@solidjs/router";

export const Breadcrumb = (props: { path: string }) => {
  const crumbs = () => props.path.split("/").filter(Boolean) || [];

  return (
    <nav class="breadcrumb">
      <A href="/gallery">home</A>
      <For each={crumbs()}>
        {(crumb, index) => {
          const path = crumbs()
            .slice(0, index() + 1)
            .join("/");
          return (
            <>
              {" / "}
              <A href={`/gallery/${path}`}>{crumb}</A>
            </>
          );
        }}
      </For>
    </nav>
  );
};

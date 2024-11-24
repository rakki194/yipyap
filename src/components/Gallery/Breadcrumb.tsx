import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import { HomeIcon, SunIcon, MoonIcon } from "~/components/icons";
import { useTheme } from "~/contexts/Theme";

export const Breadcrumb = (props: { path: string }) => {
  const crumbs = () => props.path.split("/").filter(Boolean) || [];
  const theme = useTheme();
  const isDark = () => theme.theme === "dark";

  return (
    <nav class="breadcrumb">
      <div class="breadcrumb-content">
        <div class="breadcrumb-links">
          <A href="/gallery">
            <span innerHTML={HomeIcon} />
          </A>
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
        </div>
        <button
          class="theme-toggle"
          onClick={theme.toggleTheme}
          title={isDark() ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span innerHTML={isDark() ? SunIcon : MoonIcon} />
        </button>
      </div>
    </nav>
  );
};

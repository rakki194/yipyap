import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import { HomeIcon, SunIcon, MoonIcon, CloudIcon } from "~/components/icons";
import { useTheme, getNextTheme, Theme } from "~/contexts/Theme";

function getThemeIcon(theme: Theme) {
  switch (theme) {
    case "light":
      return SunIcon;
    case "gray":
      return CloudIcon;
    case "dark":
      return MoonIcon;
  }
}

export const Breadcrumb = (props: { path: string }) => {
  const crumbs = () => props.path.split("/").filter(Boolean) || [];
  const theme = useTheme();
  const [hovered, setHovered] = createSignal(false);

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
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title={`Switch to ${getNextTheme(theme.theme)} mode`}
        >
          <span
            innerHTML={getThemeIcon(
              hovered() ? getNextTheme(theme.theme) : theme.theme
            )}
          />
        </button>
      </div>
    </nav>
  );
};

import { createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import {
  HomeIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  SpinnerIcon,
} from "~/components/icons";
import { useTheme, getNextTheme, Theme } from "~/contexts/theme";
import { useGallery } from "~/contexts/GalleryContext";

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

export const Breadcrumb = () => {
  const { params, data } = useGallery();
  const Crumbs = () => {
    const segments = () => params.path.split("/").filter(Boolean) || [];
    const crumbs = () =>
      segments().reduce<{ children: string; href: string }[]>(
        (acc, segment) => {
          const last = acc[acc.length - 1];
          acc.push({
            children: segment,
            href: last ? `${last.href}/${segment}` : `/gallery/${segment}`,
          });
          return acc;
        },
        []
      );
    return (
      <For each={crumbs()}>
        {(crumb) => {
          const path = crumb.href;
          return (
            <>
              {" / "}
              <A {...crumb} />
            </>
          );
        }}
      </For>
    );
  };

  return (
    <nav class="breadcrumb">
      <div class="breadcrumb-content">
        <div class="breadcrumb-links">
          <A href="/gallery">
            <span innerHTML={HomeIcon} />
          </A>
          <Crumbs />
        </div>
        <small>
          <Show
            when={!data.loading}
            fallback={<span class="spin-icon" innerHTML={SpinnerIcon} />}
          >
            {data()?.total_items} items
          </Show>
        </small>
        <ThemeToggle />
      </div>
    </nav>
  );
};

function ThemeToggle() {
  const theme = useTheme();
  const [hovered, setHovered] = createSignal(false);
  return (
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
  );
}

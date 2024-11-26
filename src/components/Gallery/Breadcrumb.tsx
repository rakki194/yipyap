import { createSignal, For, Show, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import {
  HomeIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  SpinnerIcon,
  FolderIcon,
  DimensionsIcon,
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

  // Compute directory and image counts
  const folderCount = createMemo(() => {
    return (
      data()?.items.filter((item) => item.type === "directory").length || 0
    );
  });

  const imageCount = createMemo(() => {
    return data()?.items.filter((item) => item.type === "image").length || 0;
  });

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
              <A href={crumb.href}>{crumb.children}</A>
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
            <span innerHTML={FolderIcon} /> {folderCount()}{" "}
            <span innerHTML={DimensionsIcon} /> {imageCount()}
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

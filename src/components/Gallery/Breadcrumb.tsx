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
import "./Breadcrumb.css";

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
            <span class="icon" innerHTML={HomeIcon} />
          </A>
          <Crumbs />
        </div>
        <small>
          <Show
            when={!data.loading}
            fallback={<span class="spin-icon icon" innerHTML={SpinnerIcon} />}
          >
            <span class="icon" innerHTML={FolderIcon} /> {data().total_folders}{" "}
            <span class="icon" innerHTML={DimensionsIcon} />{" "}
            {data().total_images}
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
      class="icon accent-hover"
      onClick={theme.toggleTheme}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Switch to ${getNextTheme(theme.theme)} mode`}
      innerHTML={getThemeIcon(
        hovered() ? getNextTheme(theme.theme) : theme.theme
      )}
    />
  );
}

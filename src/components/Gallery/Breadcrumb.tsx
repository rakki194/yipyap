import { createSignal, For, Show, createMemo, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import {
  HomeIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  SpinnerIcon,
  FolderIcon,
  DimensionsIcon,
  SettingsIcon,
  YipYap,
  BananaIcon,
  StrawberryIcon,
  PeanutIcon,
} from "~/icons";
import { useTheme, getNextTheme, Theme } from "~/contexts/theme";
import { useGallery } from "~/contexts/GalleryContext";
import { Settings } from "~/components/Settings/Settings";
import "./Breadcrumb.css";

function getThemeIcon(theme: Theme) {
  switch (theme) {
    case "light":
      return SunIcon;
    case "gray":
      return CloudIcon;
    case "dark":
      return MoonIcon;
    case "banana":
      return BananaIcon;
    case "strawberry":
      return StrawberryIcon;
    case "peanut":
      return PeanutIcon;
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

  const [showSettings, setShowSettings] = createSignal(false);

  return (
    <nav class="breadcrumb">
      <div class="breadcrumb-content">
        <div class="breadcrumb-links">
          <A href="/" aria-label="Return to the front page">
            <span class="home-icon icon" innerHTML={YipYap} title="home" />
          </A>
          <A href="/gallery">
            <span class="gallery-icon icon" innerHTML={DimensionsIcon} />
          </A>
          <Crumbs />
        </div>
        <small>
          <Suspense
            fallback={<span class="spin-icon icon" innerHTML={SpinnerIcon} />}
          >
            <Show when={data()} keyed>
              {(data) => (
                <>
                  <span class="icon" innerHTML={FolderIcon} />{" "}
                  {data.total_folders}{" "}
                  <span class="icon" innerHTML={DimensionsIcon} />{" "}
                  {data.total_images}
                </>
              )}
            </Show>
          </Suspense>
        </small>
        <div class="breadcrumb-actions">
          <ThemeToggle />
          <button
            type="button"
            class="icon"
            onClick={() => setShowSettings(!showSettings())}
            title="Settings"
            aria-label="Open settings"
            innerHTML={SettingsIcon}
          />
        </div>
      </div>
      <Show when={showSettings()}>
        <div class="settings-overlay" onClick={() => setShowSettings(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Settings onClose={() => setShowSettings(false)} />
          </div>
        </div>
      </Show>
    </nav>
  );
};

function ThemeToggle() {
  const theme = useTheme();
  const [hovered, setHovered] = createSignal(false);
  return (
    <button
      type="button"
      class="icon accent-hover"
      onClick={theme.toggleTheme}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Switch to ${getNextTheme(theme.theme)} mode`}
      aria-label={`Switch to ${getNextTheme(theme.theme)} mode`}
      innerHTML={getThemeIcon(
        hovered() ? getNextTheme(theme.theme) : theme.theme
      )}
    />
  );
}

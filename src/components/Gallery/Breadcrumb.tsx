import { createSignal, For, Show, createMemo, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import getIcon, { themeIconMap } from "~/icons";
import { useTheme, getNextTheme, Theme } from "~/contexts/theme";
import { useGallery } from "~/contexts/GalleryContext";
import { Settings } from "~/components/Settings/Settings";
import "./Breadcrumb.css";

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
            <span class="accent-hover icon" title="home">
              {getIcon("yipyap")}
            </span>
          </A>
          <A href="/gallery">
            <span class="accent icon">{getIcon("dimensions")}</span>
          </A>
          <Crumbs />
        </div>
        <small>
          <Suspense
            fallback={<span class="spin-icon icon">{getIcon("spinner")}</span>}
          >
            <Show when={data()} keyed>
              {(data) => (
                <>
                  <span class="icon">{getIcon("folder")}</span>{" "}
                  {data.total_folders}{" "}
                  <span class="icon">{getIcon("dimensions")}</span>{" "}
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
          >
            {getIcon("settings")}
          </button>
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
      class="icon accent-hover-inverted"
      onClick={theme.toggleTheme}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Switch to ${getNextTheme(theme.theme)} mode`}
      aria-label={`Switch to ${getNextTheme(theme.theme)} mode`}
    >
      {getIcon(
        themeIconMap[hovered() ? getNextTheme(theme.theme) : theme.theme]
      )}
    </button>
  );
}

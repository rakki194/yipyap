import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import getIcon from "~/icons";
import { useAppContext, getNextTheme, themeIconMap } from "~/contexts/app";
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
  const app = useAppContext();
  const [hovered, setHovered] = createSignal(false);
  const nextTheme = createMemo(() => getNextTheme(app.theme));
  return (
    <button
      type="button"
      class="icon accent-hover-inverted"
      onClick={() => app.setTheme(nextTheme())}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Switch to ${nextTheme()} mode`}
      aria-label={`Switch to ${nextTheme()} mode`}
    >
      {getIcon(themeIconMap[hovered() ? nextTheme() : app.theme])}
    </button>
  );
}

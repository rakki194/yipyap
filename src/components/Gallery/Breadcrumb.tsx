import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import getIcon from "~/icons";
import { useAppContext } from "~/contexts/app";
import { getNextTheme, themeIconMap } from "~/contexts/theme";
import { useGallery } from "~/contexts/GalleryContext";
import { Settings } from "~/components/Settings/Settings";
import "./Breadcrumb.css";


export const Breadcrumb = () => {
  const { data } = useGallery();
  const app = useAppContext();
  const t = app.t;

  const Crumbs = () => {
    const segments = () => data()?.path.split("/").filter(Boolean) || [];
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
              {t('common.pathSeparator')}
              <A href={crumb.href}>{crumb.children}</A>
            </>
          );
        }}
      </For>
    );
  };

  const [showSettings, setShowSettings] = createSignal(false);

  return (
    <>
      <Show when={app.theme === "strawberry"}>
        <div class="strawberry-decoration" />
      </Show>
      <nav class="breadcrumb">
        <div class="breadcrumb-content">
          <div class="breadcrumb-links">
            <A href="/" aria-label={t('common.returnToFrontPage')}>
              <span class="accent-hover icon" title={t('common.home')}>
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
            <MultiSelectActions />
            <ThemeToggle />
            <button
              type="button"
              class="icon"
              onClick={() => setShowSettings(!showSettings())}
              title={t('settings.title')}
              aria-label={t('common.openSettings')}
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
    </>
  );
};

function ThemeToggle() {
  const app = useAppContext();
  const t = app.t;
  const [hovered, setHovered] = createSignal(false);
  const nextTheme = createMemo(() => getNextTheme(app.theme));
  return (
    <button
      type="button"
      class="icon accent-hover-inverted"
      onClick={() => app.setTheme(nextTheme())}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={t('common.toggleTheme')}
      aria-label={t('common.toggleTheme')}
    >
      {getIcon(themeIconMap[hovered() ? nextTheme() : app.theme]!)}
    </button>
  );
}

const MultiSelectActions = () => {
  const gallery = useGallery();
  const app = useAppContext();
  const selection = gallery.selection;
  const selectedCount = () => selection.multiSelected.size;
  const hasSelection = () => selectedCount() > 0;
  
  const handleDelete = async () => {
    if (!hasSelection()) return;
    
    const message = app.t('gallery.confirmMultiDelete').replace('{{count}}', selectedCount().toString());
    if (confirm(message)) {
      const selected = Array.from(selection.multiSelected);
      for (const idx of selected) {
        await gallery.deleteImage(idx);
      }
      selection.clearMultiSelect();
    }
  };

  return (
    <Show when={hasSelection() || gallery.data()?.items.some(item => item.type === "image")}>
      <div class="multi-select-actions">
        <button
          type="button"
          class="icon"
          onClick={() => {
            if (hasSelection()) {
              selection.clearMultiSelect();
            } else {
              selection.selectAll();
            }
          }}
          title={hasSelection() ? app.t('gallery.deselectAll') : app.t('gallery.selectAll')}
        >
          {getIcon(hasSelection() ? "dismiss" : "checkAll")}
        </button>
        <Show when={hasSelection()}>
          <button
            type="button"
            class="icon delete-button"
            onClick={handleDelete}
            title={app.t('gallery.deleteSelected').replace('{{count}}', selectedCount().toString())}
          >
            {getIcon("delete")}
          </button>
        </Show>
      </div>
    </Show>
  );
};

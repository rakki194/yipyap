import { Component, For, createMemo, createSignal, onCleanup } from "solid-js";
import { A } from "@solidjs/router";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { debounce } from "@solid-primitives/scheduled";
import getIcon from "~/icons";
import "./BreadcrumbNavigation.css";

export const BreadcrumbNavigation: Component = () => {
  const app = useAppContext();
  const gallery = useGallery();
  const t = app.t;
  const { data } = gallery;

  // Create a signal to store the debounced path
  const [debouncedPath, setDebouncedPath] = createSignal("");

  // Create a debounced function to update the path
  const updatePath = debounce((path: string) => {
    setDebouncedPath(path);
  }, 100);

  // Update the debounced path whenever the actual path changes
  createMemo(() => {
    const currentPath = data()?.path || "";
    updatePath(currentPath);
  });

  const segments = () => debouncedPath().split("/").filter(Boolean) || [];
  const crumbs = () =>
    segments().reduce<{ children: string; href: string }[]>(
      (acc: { children: string; href: string }[], segment: string) => {
        const last = acc[acc.length - 1];
        acc.push({
          children: segment,
          href: last ? `${last.href}/${segment}` : `/${segment}`,
        });
        return acc;
      },
      []
    );

  // Clean up the debounced function
  onCleanup(() => {
    updatePath.clear();
  });

  return (
    <div class="breadcrumb-links">
      <A href="/" aria-label={t('common.home')}>
        <span class="accent-hover icon" title={t('common.home')}>
          {getIcon("yipyap")}
        </span>
      </A>
      <For each={crumbs()}>
        {(crumb) => (
          <>
            {t('common.pathSeparator')}
            <A href={crumb.href}>{crumb.children}</A>
          </>
        )}
      </For>
    </div>
  );
}; 
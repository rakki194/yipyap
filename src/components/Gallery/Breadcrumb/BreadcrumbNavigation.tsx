import { Component, For } from "solid-js";
import { A } from "@solidjs/router";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import getIcon from "~/icons";
import "./BreadcrumbNavigation.css";

export const BreadcrumbNavigation: Component = () => {
  const app = useAppContext();
  const gallery = useGallery();
  const t = app.t;
  const { data } = gallery;

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
    <div class="breadcrumb-links">
      <A href="/" aria-label={t('common.returnToFrontPage')}>
        <span class="accent-hover icon" title={t('common.home')}>
          {getIcon("yipyap")}
        </span>
      </A>
      <A href="/gallery">
        <span class="accent icon">{getIcon("dimensions")}</span>
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
import { Component, Show, Suspense } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import getIcon from "~/icons";
import "./BreadcrumbStats.css";

export const BreadcrumbStats: Component = () => {
  const gallery = useGallery();
  const { data } = gallery;

  return (
    <small class="breadcrumb-stats">
      <Suspense fallback={<span class="spin-icon icon">{getIcon("spinner")}</span>}>
        <Show when={data()} keyed>
          {(data) => (
            <>
              <span class="icon">{getIcon("folder")}</span>{" "}
              {data.total_folders}{" "}
              <span class="icon">{getIcon("dimensions")}</span>{" "}
              {data.total_images}
              <Show when={gallery.selection.multiSelected.size > 0 || gallery.selection.multiFolderSelected.size > 0}>
                {" "}
                <span class="icon">{getIcon("checkAll")}</span>{" "}
                {gallery.selection.multiSelected.size + gallery.selection.multiFolderSelected.size}
              </Show>
            </>
          )}
        </Show>
      </Suspense>
    </small>
  );
}; 

// src/components/Gallery/ImageGrid.tsx
import { For, onCleanup, onMount, Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";

import {
  FolderIcon,
  UpIcon,
  SpinnerIcon,
  captionIconsMap,
} from "~/components/icons";
import { useGallery } from "~/contexts/GalleryContext";
import { formatFileSize } from "~/utils/format";
import type {
  ImageItem as ImageItemType,
  BrowsePagesCached,
} from "~/resources/browse";

export const ImageGrid = (props: {
  data: BrowsePagesCached;
  onImageClick: (idx: number) => void;
}) => {
  const gallery = useGallery();
  const addObserved = makeIntersectionObserver(gallery.setPage);

  return (
    <div class="responsive-grid">
      <For each={props.data.items}>
        {(item, getIdx) => {
          let ref!: HTMLDivElement;
          const next_page = item.next_page;
          if (next_page !== undefined) {
            onMount(() => addObserved(ref, next_page));
          }
          return item.type === "image" ? (
            <ImageItem
              item={item}
              path={props.data.path}
              selected={gallery.selected === getIdx()}
              onClick={() => {
                props.onImageClick(getIdx());
                gallery.select(getIdx());
              }}
              ref={ref}
            />
          ) : (
            <DirectoryItem
              name={item.file_name}
              path={props.data.path}
              selected={gallery.selected === getIdx()}
              ref={ref}
            />
          );
        }}
      </For>
    </div>
  );
};

function makeIntersectionObserver<T>(
  callback: (assoc_value: T) => void,
  options: IntersectionObserverInit = {
    rootMargin: "100px",
    threshold: 0.01,
  }
): (el: Element, assoc_value: T) => void {
  const observer_map = new WeakMap<Element, T>();
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.boundingClientRect.top > 0) {
        const page = observer_map.get(entry.target);
        if (page) {
          callback(page);
        }
      }
    });
  }, options);
  const addObserved = (el: Element, assoc_value: T) => {
    observer_map.set(el, assoc_value);
    observer.observe(el);
    onCleanup(() => {
      observer_map.delete(el);
      observer.unobserve(el);
    });
  };
  return addObserved;
}

export const ImageItem = (props: {
  item: ImageItemType;
  path: string;
  onClick: () => void;
  ref: HTMLDivElement;
  selected: boolean;
}) => {
  const { getThumbnailSize } = useGallery();
  const [isLoading, setIsLoading] = createSignal(true);

  return (
    <div
      class="item image"
      classList={{ selected: props.selected }}
      onClick={props.onClick}
      role="link"
      ref={props.ref}
      style={{ position: "relative" }}
    >
      <Show when={props.item()} keyed>
        {(item) => {
          const thumbnailName = item.name.replace(/\.[^/.]+$/, ".webp");
          const aspectRatio = item.width / item.height;
          const { width, height } = getThumbnailSize(item);

          let imgRef!: HTMLImageElement;
          onMount(() => {
            if (imgRef.complete) {
              imgRef.classList.add("loaded");
              setIsLoading(false);
            }
          });

          return (
            <>
              <img
                ref={imgRef!}
                src={`/thumbnail/${props.path}/${thumbnailName}`}
                loading="lazy"
                width={width}
                height={height}
                style={{
                  "object-position": aspectRatio > 1 ? "center" : "top",
                  width: "100%",
                  height: "100%",
                }}
                onLoad={(e) => {
                  e.currentTarget.classList.add("loaded");
                  setIsLoading(false);
                }}
                class="loaded"
              />
              <Show when={isLoading()}>
                <span class="spin-icon" innerHTML={SpinnerIcon} />
              </Show>
            </>
          );
        }}
      </Show>
      <div class="overlay">
        <p>{props.item.file_name}</p>
        <Show when={props.item()} keyed>
          {(item) => (
            <>
              <p>
                {item.width}x{item.height} {formatFileSize(item.size)}
              </p>
              <p>
                <For each={item.captions.map((c) => c[0]).toSorted()}>
                  {(c) => (
                    <span
                      title={c}
                      innerHTML={
                        captionIconsMap[c as keyof typeof captionIconsMap]
                      }
                    ></span>
                  )}
                </For>
              </p>
            </>
          )}
        </Show>
      </div>
    </div>
  );
};

export const DirectoryItem = (props: {
  path: string;
  name: string;
  ref: HTMLDivElement;
  selected: boolean;
}) => {
  return (
    <div
      class="item directory"
      classList={{ selected: props.selected }}
      ref={props.ref}
    >
      <A href={`/gallery/${props.path}/${props.name}`} class="directory-link">
        <span innerHTML={props.name === ".." ? UpIcon : FolderIcon} />
        <span>{props.name}</span>
      </A>
    </div>
  );
};

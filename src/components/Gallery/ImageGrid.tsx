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
          let ref!: HTMLElement;
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
              ref={ref as HTMLDivElement}
            />
          ) : (
            <DirectoryItem
              ref={ref as HTMLAnchorElement}
              name={item.file_name}
              path={props.data.path}
              selected={gallery.selected === getIdx()}
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
    >
      <Show when={props.item()} keyed>
        {(item) => {
          const thumbnailName = item.name.replace(/\.[^/.]+$/, ".webp");
          const aspectRatio = item.width / item.height;
          const { width, height } = getThumbnailSize(item);

          let imgRef!: HTMLImageElement;
          onMount(() => {
            if (imgRef.complete) {
              setIsLoading(false);
            }
          });

          return (
            <>
              <img
                ref={imgRef!}
                src={`/thumbnail/${props.path}/${thumbnailName}`}
                width={width}
                height={height}
                style={{
                  "object-position": aspectRatio > 1 ? "center" : "top",
                }}
                classList={{ loaded: !isLoading() }}
                onLoad={(e) => {
                  setIsLoading(false);
                }}
              />
              <Show when={isLoading()}>
                <span class="spin-icon icon" innerHTML={SpinnerIcon} />
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
                      class="icon"
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
  ref: HTMLAnchorElement;
  path: string;
  name: string;
  selected: boolean;
}) => {
  return (
    <A
      ref={props.ref}
      class="item directory"
      classList={{ selected: props.selected }}
      href={`/gallery/${props.path}/${props.name}`}
    >
      <span
        class="icon"
        innerHTML={props.name === ".." ? UpIcon : FolderIcon}
      />
      <span>{props.name}</span>
    </A>
  );
};

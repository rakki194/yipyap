// src/components/Gallery/ImageGrid.tsx
import { For, onCleanup, onMount, Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";

import { useGallery } from "~/contexts/GalleryContext";
import { formatFileSize } from "~/utils/format";
import { joinUrlParts } from "~/utils";
import { measure_columns } from "~/directives";
import getIcon, { captionIconsMap } from "~/icons";
import type { AnyItem } from "~/resources/browse";
import type {
  ImageItem as ImageItemType,
  BrowsePagesCached,
} from "~/resources/browse";

export const ImageGrid = (props: {
  data: BrowsePagesCached;
  items: AnyItem[];
  path: string;
  onImageClick: (idx: number) => void;
}) => {
  const gallery = useGallery();
  const setColumns = gallery.selection.setColumns;
  const addObserved = makeIntersectionObserver(gallery.setPage);

  const isActive = (ref: HTMLElement, idx: number) => {
    if (gallery.mode === "view" && gallery.selected === idx) {
      ref.scrollIntoView({ behavior: "instant", block: "nearest" });
      return true;
    }
    return false;
  };

  return (
    <div class="responsive-grid" use:measure_columns={setColumns}>
      <Show when={props.path}>
        <DirectoryItem
          name=".."
          path={props.path}
          selected={gallery.selected === null}
          idx={-1}
        />
      </Show>
      <For each={props.items}>
        {(item, getIdx) => {
          let ref!: HTMLElement;
          const next_page = item.next_page;
          if (next_page !== undefined) {
            onMount(() => addObserved(ref, next_page));
          }
          return item.type === "image" ? (
            <ImageItem
              ref={ref as HTMLDivElement}
              item={item}
              idx={getIdx()}
              path={props.path}
              selected={isActive(ref, getIdx())}
              onClick={() => {
                props.onImageClick(getIdx());
                gallery.select(getIdx());
              }}
            />
          ) : (
            <DirectoryItem
              ref={ref as HTMLAnchorElement}
              name={item.file_name}
              path={props.path}
              selected={isActive(ref, getIdx())}
              idx={getIdx()}
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
  ref: HTMLDivElement;
  item: ImageItemType;
  idx: number;
  path: string;
  onClick: () => void;
  selected: boolean;
}) => {
  const gallery = useGallery();
  const { getThumbnailSize } = gallery;
  const [isLoading, setIsLoading] = createSignal(true);
  const isMultiSelected = () => gallery.selection.multiSelected.has(props.idx);

  const handleClick = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      gallery.selection.toggleMultiSelect(props.idx);
    } else {
      props.onClick();
    }
  };

  return (
    <div
      ref={props.ref}
      class="item image"
      classList={{ 
        selected: props.selected,
        "multi-selected": isMultiSelected()
      }}
      onClick={handleClick}
      role="link"
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
                src={joinUrlParts("/thumbnail", props.path, thumbnailName)}
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
                <span class="spin-icon icon">{getIcon("spinner")}</span>
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
                    <span class="icon" title={c}>
                      {getIcon(
                        captionIconsMap[c as keyof typeof captionIconsMap]
                      )}
                    </span>
                  )}
                </For>
              </p>
            </>
          )}
        </Show>
      </div>
      <Show when={isMultiSelected()}>
        <div class="multi-select-indicator">
          <span class="icon">{getIcon("check")}</span>
        </div>
      </Show>
    </div>
  );
};

export const DirectoryItem = (props: {
  ref?: HTMLAnchorElement;
  path: string;
  name: string;
  selected: boolean;
  idx: number;
}) => {
  const gallery = useGallery();
  const isMultiSelected = () => gallery.selection.multiFolderSelected.has(props.idx);

  const handleClick = (e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      gallery.selection.toggleFolderMultiSelect(props.idx);
    }
  };

  return (
    <A
      ref={props.ref}
      class="item directory"
      classList={{ 
        selected: props.selected,
        "multi-selected": isMultiSelected()
      }}
      onClick={handleClick}
      href={joinUrlParts("/gallery", props.path, props.name)}
    >
      <Show when={isMultiSelected()}>
        <div class="multi-select-indicator">
          <span class="icon">{getIcon("check")}</span>
        </div>
      </Show>
      <span class="icon">
        {getIcon(props.name === ".." ? "folderArrowUp" : "folder")}
      </span>
      <span>{props.name}</span>
    </A>
  );
};

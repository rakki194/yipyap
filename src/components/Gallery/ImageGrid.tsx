// src/components/Gallery/ImageGrid.tsx
import { For, onCleanup, onMount, Show, createEffect } from "solid-js";
import type { JSX } from "solid-js";
import { A } from "@solidjs/router";

import FolderIcon from "@fluentui/svg-icons/icons/folder_24_regular.svg?raw";
import UpIcon from "@fluentui/svg-icons/icons/location_arrow_up_20_regular.svg?raw";
import TagIcon from "@fluentui/svg-icons/icons/tag_24_regular.svg?raw";
import NotepadIcon from "@fluentui/svg-icons/icons/notepad_24_regular.svg?raw";
import SubtitlesIcon from "@fluentui/svg-icons/icons/subtitles_24_regular.svg?raw";

import { useGallery } from "~/contexts/GalleryContext";
import { formatFileSize } from "~/utils/format";
import { getThumbnailComputedSize } from "~/utils/sizes";
import type { ImageItem as ImageItemType, AnyItem } from "~/resources/browse";

interface ImageGridProps {
  items: AnyItem[];
  path: string;
  onImageClick: (idx: number) => void;
  gridRef: (el: HTMLDivElement) => void;
}

export const ImageGrid = (props: ImageGridProps) => {
  const { state, actions } = useGallery();

  const addObserved = makeIntersectionObserver(actions.setPage);

  createEffect(() => {
    console.log("ImageGrid::state.selected", state.selected);
  });

  return (
    <div class="responsive-grid" ref={props.gridRef}>
      <For each={props.items}>
        {(item, getIdx) => {
          let ref!: HTMLDivElement;
          const next_page = item.next_page;
          if (next_page !== undefined) {
            onMount(() => addObserved(ref, next_page));
          }
          const path = `${props.path}/${item.file_name}`;
          return item.type === "image" ? (
            <ImageItem
              item={item}
              path={path}
              selected={state.selected === getIdx()}
              onClick={() => {
                props.onImageClick(getIdx());
                actions.select(getIdx());
              }}
              ref={ref}
            />
          ) : (
            <DirectoryItem name={item.file_name} path={path} ref={ref} />
          );
          // console.log('For::item', { ...item, value: item() }, getIdx(), el);
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
        console.log("observed:", entry.boundingClientRect);
        const page = observer_map.get(entry.target);
        if (page) {
          console.log(entry, "page", page);
          callback(page);
        }
      }
    });
  }, options);
  const addObserved = (el: Element, assoc_value: T) => {
    // console.log('addObserved', el, assoc_value);
    observer_map.set(el, assoc_value);
    observer.observe(el);
    onCleanup(() => {
      observer_map.delete(el);
      observer.unobserve(el);
    });
  };
  return addObserved;
}

const iconsMap = {
  txt: NotepadIcon,
  tags: TagIcon,
  caption: SubtitlesIcon,
};

export const ImageItem = (props: {
  item: ImageItemType;
  path: string;
  onClick: () => void;
  ref: HTMLDivElement;
  selected: boolean;
}) => {
  // createEffect(() => console.log('ImageItem', props.item()))
  return (
    <div
      class="item image"
      classList={{ selected: props.selected }}
      onClick={props.onClick}
      tabindex="0"
      role="link"
      ref={props.ref}
    >
      <Show when={props.item()} keyed>
        {(item) => {
          const thumbnailPath = props.path.replace(/\.[^/.]+$/, ".webp");
          const aspectRatio = item.width / item.height;

          const { width, height } = getThumbnailComputedSize(item);

          let imgRef!: HTMLImageElement;
          onMount(() => {
            if (imgRef.complete) {
              imgRef.classList.add("loaded");
            }
          });

          return (
            <img
              ref={imgRef!}
              src={`/thumbnail/${thumbnailPath}`}
              loading="lazy"
              width={width}
              height={height}
              style={{ "object-position": aspectRatio > 1 ? "center" : "top" }}
              onLoad={(e) => e.currentTarget.classList.add("loaded")}
            />
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
                      innerHTML={iconsMap[c as keyof typeof iconsMap]}
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
}) => {
  return (
    <div class="item directory" ref={props.ref}>
      <A href={`/gallery/${props.path}`} class="directory-link">
        <span innerHTML={props.name === ".." ? UpIcon : FolderIcon} />
        <span>{props.name}</span>
      </A>
    </div>
  );
};

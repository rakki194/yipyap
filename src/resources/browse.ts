import type {} from "../models";
import { fetchStreamingJson } from "../utils/streaming_json";
import {
  Accessor,
  createResource,
  createSignal,
  InitializedResourceReturn,
  Setter,
  untrack,
} from "solid-js";
import { createStaticStore } from "@solid-primitives/static-store";
import { joinUrlParts } from "~/utils";

interface FolderHeader {
  file_name: string;
  mtime: string; // ISO format date string
  page: number;
  pages: number;
  folders: string[]; // Array of folder names
  images: string[]; // Array of image names
  total_folders: number;
  total_images: number;
}

interface BaseData {
  type: "directory" | "image";
  name: string;
  mtime: string;
}

export interface DirectoryData extends BaseData {
  type: "directory";
}

export interface ImageData extends BaseData {
  type: "image";
  size: number; // Size of the image
  mime: string; // MIME type of the image
  md5sum: string; // MD5 checksum of the image
  width: number; // Width of the image
  height: number; // Height of the image
  captions: Captions; // Array of tuples for captions
}

// Captions is an array of tuples of strings
// The first string is the suffix of the caption, the second is the caption text.
export type Captions = [string, string][];

type AnyData = DirectoryData | ImageData;

// unlike *Data, *Item can be in a loading state signaled by the call operator returning undefined
interface BaseItem {
  file_name: string; // We can't overload `name` because the resource does
  type: "directory" | "image";
  next_page?: number;
  // Accessor for the potentially loaded item data
  (): DirectoryData | ImageData | undefined;
}

export interface DirectoryItem extends BaseItem {
  type: "directory";
  (): DirectoryData | undefined;
}

export interface ImageItem extends BaseItem {
  type: "image";
  (): ImageData | undefined;
}

export type AnyItem = DirectoryItem | ImageItem;

// type LoadingItem<T extends BaseItem = AnyItem> = T extends BaseItem
//     ? BaseItem & { loaded: false, (): ReturnType<T> }
//     : never;

function fetchPage(
  path: string,
  page: number,
  onHeader: (data: FolderHeader) => void,
  onItem: (data: AnyData) => void,
  onError: (error: Error) => void
): Promise<void> {
  return fetchStreamingJson(
    `/api/browse?path=${path}&page=${page}&page_size=32`,
    (item, idx) => {
      if (idx === 0) {
        onHeader(item as FolderHeader);
      } else {
        onItem(item as AnyData);
      }
    }
  ).catch(onError);
}

export type BrowsePageResult = {
  path: string;
  page: number;
  total_pages: number;
  total_folders: number;
  total_images: number;
  mtime: string;
  items: Map<string, AnyItem>;
  setters: Record<string, Setter<AnyData | undefined>>;
};

export function fetchPageItemsAsSignals(
  path: string,
  page: number
): Promise<BrowsePageResult> {
  return new Promise<BrowsePageResult>((resolve, reject) => {
    const items = new Map<string, AnyItem>();
    const setters = {} as Record<string, Setter<AnyData | undefined>>;
    fetchPage(
      path,
      page,
      (folderHeader) => {
        let last_item: AnyItem | undefined;
        for (const folder_name of folderHeader.folders) {
          const [item, setItem] = createSignal<DirectoryData>();
          last_item = Object.assign(item, {
            file_name: folder_name,
            loaded: false,
            type: "directory" as const,
          });
          items.set(folder_name, last_item);
          setters[folder_name] = setItem as Setter<AnyData | undefined>;
        }
        for (const file_name of folderHeader.images) {
          const [item, setItem] = createSignal<ImageData>();
          last_item = Object.assign(item, {
            file_name,
            loaded: false,
            type: "image" as const,
          });
          items.set(file_name, last_item);
          setters[file_name] = setItem as Setter<AnyData | undefined>;
        }
        last_item &&
          page + 1 <= folderHeader.pages &&
          (last_item.next_page = page + 1);
        // console.log("fetched page", { path, page, folderHeader });
        resolve({
          path,
          page,
          total_pages: folderHeader.pages,
          total_folders: folderHeader.total_folders,
          total_images: folderHeader.total_images,
          mtime: folderHeader.mtime,
          items,
          setters,
        });
      },
      (item) => {
        const setter = setters[item.name];
        setter && setter(item);
      },
      reject
    );
  });
}

type NavState = { path: string; page: number };
type NameToItem = Map<string, AnyItem>;
type PageToItems = Record<number, NameToItem>;

export function createGalleryRessource(
  getNavState: Accessor<NavState>
): InitializedResourceReturn<BrowsePageResult> {
  const items = new Map<string, AnyItem>();
  const initialValue = {
    ...untrack(getNavState),
    total_pages: -1,
    total_folders: -1,
    total_images: -1,
    mtime: "",
    items,
    setters: {},
  };
  return createResource<BrowsePageResult, NavState>(
    getNavState,
    ({ path, page }, { value, refetching }) =>
      fetchPageItemsAsSignals(path, page),
    { initialValue }
  );
}

export type BrowsePagesCached = {
  path: string;
  mtime: string;
  total_pages: number;
  total_folders: number;
  total_images: number;
  pages: PageToItems;
  items: AnyItem[];
  setters: Record<string, Setter<AnyData | undefined>>;
};

export function createGalleryResourceCached(
  getNavState: Accessor<NavState>
): InitializedResourceReturn<BrowsePagesCached> {
  const initialValue = {
    path: untrack(getNavState).path,
    mtime: "",
    total_pages: -1,
    total_folders: -1,
    total_images: -1,
    pages: {},
    items: [],
    setters: {},
  };
  return createResource<BrowsePagesCached, NavState>(
    getNavState,
    async (
      { path, page },
      { value: prev_value, refetching }
    ): Promise<BrowsePagesCached> => {
      if (prev_value === undefined) {
        throw new Error("value is undefined");
      }
      const samePath = path === prev_value.path;
      if (
        // (prev_value.total_pages >= 0 && page > prev_value.total_pages) ||
        samePath &&
        prev_value.pages[page] !== undefined &&
        !refetching
      ) {
        // console.log("skipping fetch", { path, page });
        return prev_value as BrowsePagesCached;
      }

      const result = await fetchPageItemsAsSignals(path, page);

      const pages = samePath ? { ...prev_value.pages } : {};
      pages[page] = result.items;
      const items = Object.values(pages).reduce((acc, pageItems) => {
        acc.push(...pageItems.values());
        return acc;
      }, [] as AnyItem[]);

      return {
        path,
        total_pages: result.total_pages,
        total_folders: result.total_folders,
        total_images: result.total_images,
        mtime: result.mtime,
        pages,
        items,
        setters: result.setters,
      };
    },
    { initialValue }
  );
}

export interface SaveCaption {
  caption: string;
  type: string;
}

// Function to save caption to the backend
export function saveCaption(
  path: string,
  imageName: string,
  data: SaveCaption
): Promise<Response> {
  return fetch(`/caption/${path}/${imageName}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption: data.caption, type: data.type }),
  });
}

export interface DeleteImageResponse {
  confirm: boolean;
  deleted_suffixes: string[];
}

export async function deleteImage(
  path: string,
  imageName: string,
  confirm: boolean = false
): Promise<DeleteImageResponse> {
  const response = await fetch(
    `/api/browse/${path}/${imageName}?confirm=${confirm}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to delete image", {
      path,
      imageName,
      confirm,
      status: response.status,
      error: errorText,
    });
    throw new Error(`Failed to delete image: ${errorText}`);
  }

  return (await response.json()) as DeleteImageResponse;
}

export async function deleteCaption(path: string, name: string, type: string) {
  try {
    const response = await fetch(
      `${joinUrlParts("/api/caption", path, name)}?caption_type=${type}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete caption: ${response.statusText}`);
    }
    // Handle successful deletion, e.g., update UI or state
  } catch (error) {
    console.error(error);
    // Optionally, handle the error in the UI
  }
}

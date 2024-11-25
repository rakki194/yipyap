import { on, createEffect, untrack, mergeProps } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams, useSearchParams, action } from "@solidjs/router";
import { createWindowSize, Size } from "@solid-primitives/resize-observer";
import {
  createGalleryResourceCached,
  Captions,
  saveCaption as saveCaptionToBackend,
  deleteImage as deleteImageFromBackend,
} from "~/resources/browse";
import type {
  ImageData,
  SaveCaption,
  BrowsePagesCached,
} from "~/resources/browse";
import { createConfigResource, getThumbnailComputedSize } from "~/utils/sizes";
import { useSelection } from "./selection";

export interface GalleryState {
  viewMode: "grid" | "list";
  sort: "name" | "date" | "size";
  search: string;
  page: number;
  mode: "view" | "edit";
}

export type GalleryContextValue = ReturnType<typeof makeGalleryState>;

export type { SaveCaption };

// Call in reactive contexts only
export function makeGalleryState() {
  // State part of the URL
  // FIXME: Most of these are unused, but eventually we want to have some search params in the URL
  const [searchParams, setSearchParams] = useSearchParams<{
    page?: string;
  }>();

  // State that is not part of the URL
  // Also some unused stuff: only `page`, `selected`, and `mode` are used. The rest is here for future use
  const [state, setState] = createStore<GalleryState>({
    viewMode: "grid",
    sort: "name",
    search: "",
    page: Number(searchParams.page) || 1,
    mode: "view",
  });

  const params = useParams<{ path: string }>();

  // Effect: Reset page and selected image when the path changes
  createEffect(
    on(
      () => params.path,
      (path, prevPath) => {
        if (path !== prevPath) {
          setState("page", 1);
          selection.select(null);
        }
      },
      { defer: true }
    )
  );

  // Effect: Load the next page when the selected image changes
  createEffect(
    on(
      () => selection.selectedImage,
      (image) => {
        if (image?.next_page !== undefined) {
          setState("page", image.next_page);
        }
      }
    )
  );

  // Data sources and actions
  const [config, refetchConfig] = createConfigResource();
  if (import.meta.env.DEV)
    createEffect(() => config() && console.debug("Config", config()));

  // Our data source for directory listings. Calls the `/browse` and memoizes pages.
  const [backendData, { refetch, mutate: setData }] =
    createGalleryResourceCached(() => ({
      path: params.path || "/",
      page: state.page,
    }));

  const selection = useSelection(backendData);

  const saveCaption = action(async (data: SaveCaption) => {
    const { image, path, database } = untrack(() => ({
      image: selection.editedImage,
      path: params.path,
      database: backendData(),
    }));
    if (!image) return new Error("No image to save caption for");

    try {
      // Save caption to the backend
      const response = await saveCaptionToBackend(path, image.name, data);

      if (!response.ok) {
        return new Error(`${response.status}: ${response.statusText}`);
      }

      // Update local state after successful save
      const updatedImage = updateLocalCaptions(image, data, database);

      return { success: true, image: updatedImage };
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to save caption", error);
      return new Error("Failed to save caption");
    }
  });

  const deleteImage = action(async (idx: number) => {
    const { path, database } = untrack(() => ({
      path: params.path,
      database: backendData(),
    }));

    const image = database.items[idx];
    console.log("Deleting image", idx, { ...image }, { ...image() });
    if (!image || image.type !== "image")
      return new Error("No image to delete");

    try {
      const response = await deleteImageFromBackend(path, image.file_name);
      if (!response.ok) {
        return new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to delete image", error);
      return new Error("Failed to delete image");
    }

    // Delete the idx'th image from the database using slice and spread for better readability
    const items = [
      ...database.items.slice(0, idx),
      ...database.items.slice(idx + 1),
    ];

    const data = {
      ...database,
      items,
      total_items: database.total_items - 1,
    };
    setData(data);

    return items;
  });

  const windowSize = createWindowSize();

  // Gallery actions and getters
  const gallery = {
    setViewMode: (mode: "grid" | "list") => {
      setState("viewMode", mode);
      // setSearchParams({ view: mode });
    },
    setSort: (sort: "name" | "date" | "size") => {
      setState("sort", sort);
      // setSearchParams({ sort });
    },
    setSearch: (search: string) => {
      setState("search", search);
      setState("page", 1);
      // setSearchParams({ search, page: '1' });
    },
    setPage: (page: number) => {
      setState("page", page);
      // setSearchParams({ page: page.toString() });
    },
    getPreviewSize: (image: Size) =>
      getThumbnailComputedSize(image, config()?.preview_size || [1024, 1024]),
    getThumbnailSize: (image: Size) =>
      getThumbnailComputedSize(image, config()?.thumbnail_size || [300, 300]),
    windowSize,
    params,
    data: backendData,
    state,
    saveCaption,
    deleteImage,
  };

  if (import.meta.env.DEV)
    createEffect(() => {
      console.debug(
        "GalleryState update",
        filterFunctions({
          ...gallery,
          ...selection,
        })
      );
    });

  if (import.meta.env.DEV)
    console.log(
      "Initialized GalleryState context",
      filterFunctions({
        ...gallery,
        ...selection,
      })
    );

  // Merge gallery and selection properties
  return mergeProps(gallery, selection);
}

// Function to update local captions after a successful save
function updateLocalCaptions(
  image: ImageData,
  data: SaveCaption,
  backendData: BrowsePagesCached
) {
  const setter = backendData.setters[image.name];
  if (setter) {
    // Update the captions array with the new caption
    const newCaptions = image.captions.map(([type, caption]) =>
      type === data.type ? [type, data.caption] : [type, caption]
    );
    return setter({
      ...image,
      captions: newCaptions as Captions,
    });
  }
}

function filterFunctions(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => typeof v !== "function")
  );
}

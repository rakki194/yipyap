import { on, createEffect, untrack, mergeProps, from } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { useParams, useSearchParams, action } from "@solidjs/router";
import { createWindowSize, Size } from "@solid-primitives/resize-observer";
import { createGalleryResourceCached, Captions } from "~/resources/browse";
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

export interface SaveCaption {
  caption: string;
  type: string;
}

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

  // Our data source for directory listings. Calls the `/browse` and memoizes pages.
  const [backendData, { refetch, mutate: setData }] =
    createGalleryResourceCached(() => ({
      path: params.path || "/",
      page: state.page,
    }));

  const selection = useSelection(backendData);

  const saveCaption = action(async (data: SaveCaption) => {
    const image = untrack(() => selection.editedImage);
    if (!image) return new Error("No image to save caption for");

    try {
      // console.log("saveCaption", { path: params.path, image, ...data });
      const response = await fetch(`/caption/${params.path}/${image.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: data.caption, type: data.type }),
      });

      if (!response.ok) {
        return new Error(`${response.status}: ${response.statusText}`);
      }

      // Update local state after successful save
      const setter = untrack(() => backendData().setters[image.name]);
      if (setter) {
        // Update the captions array with the new caption
        const newCaptions = image.captions.map(([type, caption]) =>
          type === data.type ? [type, data.caption] : [type, caption]
        );
        setter({
          ...image,
          captions: newCaptions as Captions,
        });
      }

      return { success: true };
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to save caption", error);
      return new Error("Failed to save caption");
    }
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
      getThumbnailComputedSize(image, config()?.preview_size || [300, 300]),
    getThumbnailSize: (image: Size) =>
      getThumbnailComputedSize(image, config()?.thumbnail_size || [1024, 1024]),
    windowSize,
    params,
    data: backendData,
    state,
    saveCaption,
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

function filterFunctions(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => typeof v !== "function")
  );
}

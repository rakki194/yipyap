import {
  createContext,
  useContext,
  ParentComponent,
  on,
  createEffect,
  Resource,
  createMemo,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  useParams,
  useLocation,
  useSearchParams,
  action,
  Action,
} from "@solidjs/router";
import { createWindowSize, Size } from "@solid-primitives/resize-observer";
import {
  createGalleryRessourceCached,
  BrowsePagesCached,
  ImageItem,
  ImageData,
  Captions,
} from "~/resources/browse";
import { createConfigResource, getThumbnailComputedSize } from "~/utils/sizes";

export type { Size };

interface GalleryState {
  viewMode: "grid" | "list";
  sort: "name" | "date" | "size";
  search: string;
  page: number;
  selected: number | null;
  mode: "view" | "edit";
}

interface GalleryContextValue {
  setViewMode: (mode: "grid" | "list") => void;
  setSort: (sort: "name" | "date" | "size") => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;

  selectedImage: ImageItem | null;
  select: (idx: number | null) => void;
  selectNext: () => void;
  selectPrev: () => void;

  editedImage: ImageData | null;
  setMode: (mode: "view" | "edit") => void;
  toggleEdit: () => void;
  // Select + switch to edit mode
  edit: (idx: number) => boolean;

  getPreviewSize: (image: Size) => Size;
  getThumbnailSize: (image: Size) => Size;

  params: { path: string };
  windowSize: Readonly<Size>;
  data: Resource<BrowsePagesCached>;
  state: GalleryState;
  saveCaption: Action<[SaveCaption], Error | { success: boolean }>;
}

export interface SaveCaption {
  path: string;
  caption: string;
  type: string;
}

// call in reactive contexts only
export /*FIXME*/ function makeGalleryState(): GalleryContextValue {
  // State part of the url
  // FIXME: most of these are unused, but eventually we want to have some search params in the url
  const [searchParams, setSearchParams] = useSearchParams<{
    view?: "grid" | "list";
    sort?: "name" | "date" | "size";
    search?: string;
    page?: string;
    edit?: string;
  }>();

  // State that is not part of the url
  // Also some unused stuff: only `page, \selected` and mode` are used, the rest is just here for future use
  const [state, setState] = createStore<GalleryState>({
    viewMode: searchParams.view || "grid",
    sort: searchParams.sort || "name",
    search: searchParams.search || "",
    page: Number(searchParams.page) || 1,
    selected: null,
    mode: "view",
  });

  const params = useParams<{ path: string }>();
  // const [searchParams, setSearchParams] = useSearchParams<{ path?: string, page?: string }>();

  // Effect on page change: reset page and selected image
  createEffect(
    on(
      () => params.path,
      (path, prev_path) => {
        if (path !== prev_path) {
          setState("page", 1);
          setState("selected", null);
        }
      },
      { defer: true }
    )
  );

  // Data sources, actions

  const [config, refetchConfig] = createConfigResource();
  // Our data source for directory listings. Calls the`/browse` and memoize pages.
  const [backendData, { refetch, mutate: setData }] =
    createGalleryRessourceCached(() => ({
      path: params.path || "/",
      page: state.page,
    }));
  const saveCaption = action(async (data: SaveCaption) => {
    try {
      const response = await fetch(`/caption/${data.path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: data.caption, type: data.type }),
      });

      if (!response.ok) {
        return new Error("Failed to save caption");
      }

      // Update local state after successful save
      const image = getEditedImage();
      if (image) {
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
      }

      return { success: true };
    } catch (error) {
      return new Error("Failed to save caption");
    }
  });

  const windowSize = createWindowSize();

  const select = (idx: number | null) => {
    if (idx === null) {
      setState("selected", null);
      setState("mode", "view");
      return true;
    } else if (idx >= 0 && idx < untrack(backendData).items.length) {
      setState("selected", idx);
      const item = untrack(backendData).items[idx];
      if (item.next_page !== undefined) {
        setState("page", item.next_page);
      }
      return true;
    } else {
      return false;
    }
  };

  const setMode = (mode: "view" | "edit") => {
    if (mode === "edit") {
      if (untrack(getSelectedImage) !== null) {
        setState("mode", "edit");
      } else {
        return false;
      }
    } else {
      setState("mode", mode);
    }

    return true;
  };

  const getSelectedImage = createMemo(() => {
    if (state.selected === null) return null;
    const image = backendData().items[state.selected];
    if (image && image.type === "image") {
      return image;
    } else {
      return null;
    }
  });

  const getEditedImage = createMemo(() => {
    if (state.mode != "edit") return null;
    const item = getSelectedImage();
    if (item === null) return null;
    return item() || null;
  });

  return {
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
    select,
    selectNext: () => {
      select(untrack(() => (state.selected === null ? 0 : state.selected + 1)));
    },
    selectPrev: () => {
      select(
        untrack(() =>
          state.selected === null
            ? backendData().items.length - 1
            : state.selected - 1
        )
      );
    },
    setMode,
    toggleEdit: () => {
      setMode(untrack(() => (state.mode === "edit" ? "view" : "edit")));
    },
    edit: (idx: number) => {
      select(idx);
      return setMode("edit");
    },
    get selectedImage() {
      return getSelectedImage();
    },
    get editedImage() {
      return getEditedImage();
    },
    getPreviewSize: (image) =>
      getThumbnailComputedSize(image, config()?.preview_size || [300, 300]),
    getThumbnailSize: (image) =>
      getThumbnailComputedSize(image, config()?.thumbnail_size || [1024, 1024]),
    windowSize,
    params,
    data: backendData,
    state,
    saveCaption,
  };
}

export /*FIXME*/ const GalleryContext = createContext<GalleryContextValue>();

export const GalleryProvider: ParentComponent = (props) => {
  return (
    <GalleryContext.Provider value={makeGalleryState()}>
      {props.children}
    </GalleryContext.Provider>
  );
};

export function useGallery(): GalleryContextValue {
  const context = useContext(GalleryContext);
  if (!context)
    throw new Error("useGallery must be used within a GalleryProvider");
  return context;
}

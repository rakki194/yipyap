import {
  createContext,
  useContext,
  ParentComponent,
  on,
  createEffect,
  Resource,
  createMemo,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useParams, useLocation, useSearchParams } from "@solidjs/router";
import { createWindowSize, Size } from "@solid-primitives/resize-observer";
import {
  createGalleryRessourceCached,
  BrowsePagesCached,
  ImageItem,
} from "~/resources/browse";

interface GalleryState {
  viewMode: "grid" | "list";
  sort: "name" | "date" | "size";
  search: string;
  page: number;
  selected: number | null;
  mode: "view" | "edit";
}

interface GalleryContextValue {
  state: GalleryState;
  actions: {
    setViewMode: (mode: "grid" | "list") => void;
    setSort: (sort: "name" | "date" | "size") => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    select: (idx: number | null) => void;
    selectNext: () => void;
    selectPrev: () => void;
    setMode: (mode: "view" | "edit") => void;
    toggleEdit: () => void;
    editedImage: ImageItem | null;
    // Select + switch to edit mode
    edit: (idx: number) => boolean;
  };
  windowSize: Readonly<Size>;
  params: { path: string };
  data: Resource<BrowsePagesCached>;
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

  // Our data source for directory listings. Calls the`/browse` and memoize pages.
  const [data, { refetch, mutate: setData }] = createGalleryRessourceCached(
    () => ({
      path: params.path || "/",
      page: state.page,
    })
  );

  const windowSize = createWindowSize();

  const select = (idx: number | null) => {
    if (idx === null) {
      setState("selected", null);
      setState("mode", "view");
      return true;
    } else if (idx >= 0 && idx < data().items.length) {
      setState("selected", idx);
      return true;
    } else {
      return false;
    }
  };

  const setMode = (mode: "view" | "edit") => {
    if (mode === "edit") {
      if (getSelectedImage() !== null) {
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
    const image = data().items[state.selected];
    if (image && image.type === "image") {
      return image;
    } else {
      return null;
    }
  });

  const getEditedImage = createMemo(() => {
    console.log("state.mode", state.mode);
    if (state.mode != "edit") return null;
    return getSelectedImage();
  });

  const actions = {
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
      select(state.selected === null ? 0 : state.selected + 1);
    },
    selectPrev: () => {
      select(
        state.selected === null ? data().items.length - 1 : state.selected - 1
      );
    },
    setMode,
    toggleEdit: () => {
      setMode(state.mode === "edit" ? "view" : "edit");
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
    get windowSize() {
      return windowSize;
    },
  };

  // FIXME: we should create some convenience view projection of the public using createMemo for the application state
  return { state, actions, windowSize, params, data };
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

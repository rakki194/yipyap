import {
  createContext,
  useContext,
  ParentComponent,
  on,
  createEffect,
  Resource,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useParams, useLocation, useSearchParams } from "@solidjs/router";
import { createWindowSize, Size } from "@solid-primitives/resize-observer";
import {
  createGalleryRessourceCached,
  BrowsePagesCached,
} from "~/resources/browse";

interface GalleryState {
  viewMode: "grid" | "list";
  sort: "name" | "date" | "size";
  search: string;
  page: number;
  selected: number | null;
}

interface GalleryContextValue {
  state: GalleryState;
  actions: {
    setViewMode: (mode: "grid" | "list") => void;
    setSort: (sort: "name" | "date" | "size") => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    select: (idx: number) => void;
  };
  windowSize: Readonly<Size>;
  params: { path: string };
  data: Resource<BrowsePagesCached>;
}

// call in reactive contexts only
export /*FIXME*/ function makeGalleryState(): GalleryContextValue {
  // const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams<{
    view?: "grid" | "list";
    sort?: "name" | "date" | "size";
    search?: string;
    page?: string;
    edit?: string;
  }>();

  const [state, setState] = createStore<GalleryState>({
    viewMode: searchParams.view || "grid",
    sort: searchParams.sort || "name",
    search: searchParams.search || "",
    page: Number(searchParams.page) || 1,
    selected: null,
  });

  const params = useParams<{ path: string }>();
  // const [searchParams, setSearchParams] = useSearchParams<{ path?: string, page?: string }>();

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

  const [data, { refetch, mutate: setData }] = createGalleryRessourceCached(
    () => ({
      path: params.path || "/",
      page: state.page,
    })
  );

  const windowSize = createWindowSize();

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
    select: (idx: number) => {
      setState("selected", idx);
    },
  };

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

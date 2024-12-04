import {
  on,
  createEffect,
  untrack,
  mergeProps,
  batch,
  startTransition,
} from "solid-js";
import { createStaticStore } from "@solid-primitives/static-store";
import { useParams, useSearchParams, action } from "@solidjs/router";
import { createWindowSize, Size } from "@solid-primitives/resize-observer";
import {
  createGalleryResourceCached,
  saveCaption as saveCaptionToBackend,
  deleteImage as deleteImageFromBackend,
  deleteCaption as deleteCaptionFromBackend,
} from "~/resources/browse";
import type {
  ImageData,
  SaveCaption,
  BrowsePagesCached,
  AnyItem,
  Captions,
} from "~/resources/browse";
import { createConfigResource, getThumbnailComputedSize } from "~/utils/sizes";
import { useSelection } from "./selection";
import { joinUrlParts, replaceExtension, cacheNavigation } from "~/utils";
import { makeImage, ReactiveImage } from "~/components/reactive-utils";

export interface GalleryState {
  viewMode: "grid" | "list";
  sort: "name" | "date" | "size";
  search: string;
  page: number;
  path: string;
}

export type GalleryContextType = ReturnType<typeof makeGalleryState>;

export type { SaveCaption };

/* The static part of the image information that is fed to the ImageViewer
Contains metadata, path for various sized of the image and the image elements themselves */
export type ImageInfo = {
  idx: number;
  name: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  mtime: string;
  preview_path: string;
  thumbnail_path: string;
  download_path: string;
  aspect_ratio: string;
  preview_img: ReactiveImage;
  thumbnail_img: ReactiveImage;
};

const getImageInfo = (item: AnyItem, idx: number, pathParam?: string) => {
  if (item.type !== "image") return undefined;

  const image = item();
  if (!image) return undefined;

  const { name, width, height, size, mime, mtime } = image;
  const resolvedPath = pathParam || "/";
  const webpName = replaceExtension(name, ".webp");

  const thumbnail_path = joinUrlParts("/thumbnail", resolvedPath, webpName);
  const preview_path = joinUrlParts("/preview", resolvedPath, webpName);
  const download_path = joinUrlParts("/download", resolvedPath, name);
  const aspect_ratio = `${width}/${height}`;

  const imageInfo = {
    idx,
    name,
    width,
    height,
    size,
    mime,
    mtime,
    aspect_ratio,
    preview_path,
    thumbnail_path,
    download_path,
    get captions() {
      return item()!.captions;
    },
  };

  if (import.meta.env.DEV) {
    console.log("ImageInfo", idx, imageInfo);
  }

  return imageInfo;
};

export interface FolderInfo {
  name: string;
  path: string;
  fullPath: string;
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
  const [state, setState] = createStaticStore<GalleryState>({
    path: "",
    viewMode: "grid",
    sort: "name",
    search: "",
    page: Number(searchParams.page) || 1,
  });
  const setPage = (page: number) =>
    startTransition(() => setState("page", page));

  const params = useParams<{ path: string }>();

  // Data sources and actions
  const [config, refetchConfig] = createConfigResource();
  if (import.meta.env.DEV)
    createEffect(() => config() && console.debug("Config", config()));

  // Our data source for directory listings. Calls the `/browse` and memoizes pages.
  const [backendData, { refetch, mutate: setData }] =
    createGalleryResourceCached(() => ({
      path: state.path,
      page: state.page,
    }));

  const selection = useSelection(backendData);

  const [getEditedImage, clearImageCache] = cacheNavigation(
    () => backendData()?.items || [],
    () => selection.selected,
    (item, idx) => {
      const image_info = getImageInfo(item, idx, backendData()?.path);
      if (image_info == undefined) return undefined;
      const { preview_path, thumbnail_path, aspect_ratio } = image_info;

      const style = { "aspect-ratio": aspect_ratio };
      const preview_img = makeImage(
        preview_path,
        image_info.name,
        ["preview"],
        style
      );
      const thumbnail_img = makeImage(
        thumbnail_path,
        image_info.name,
        ["thumbnail"],
        style
      );

      if (item.next_page != undefined) {
        setPage(item.next_page);
      }

      return {
        ...image_info,
        idx,
        preview_img,
        thumbnail_img,
      } as ImageInfo;
    },
    {
      preload_fwd: 2,
      preload_rev: 1,
      keep_fwd: 6,
      keep_rev: 6,
      unload: (img, idx) => {
        // console.log("unloading from cache", { idx, name: img?.name });
        img.preview_img.unload();
        img.thumbnail_img.unload();
      },
    }
  );

  // Effect: Reset page and selected image when the path changes
  createEffect(
    on(
      () => params.path,
      (path, prevPath) => {
        if (path !== prevPath) {
          batch(() => {
            setState({ page: 1, path: path });
            selection.select(null);
            clearImageCache();
          });
        }
      }
    )
  );

  // Effect: Load the next page when the selected image changes
  createEffect(
    on(
      () => selection.selectedImage,
      (image) => {
        if (image?.next_page !== undefined) {
          setPage(image.next_page);
        }
      }
    )
  );

  const saveCaption = action(async (data: SaveCaption) => {
    const { image, database } = untrack(() => ({
      image: selection.editedImage,
      database: backendData(),
    }));
    if (!image) return new Error("No image to save caption for");
    if (!database) return new Error("No page fetched yet!");

    try {
      // Save caption to the backend
      const response = await saveCaptionToBackend(
        database.path,
        image.name,
        data
      );

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
    const database = untrack(backendData);
    if (!database) return new Error("No page fetched yet!");
    const image = database.items[idx];
    console.log("Deleting image", idx, { ...image }, { ...image() });
    if (!image || image.type !== "image")
      return new Error("No image to delete");

    try {
      const confirm = true; // FIXME: ask the user for confirmation
      const response = await deleteImageFromBackend(
        database.path,
        image.file_name,
        confirm
      );
      if (import.meta.env.DEV)
        console.debug("Delete image response", { idx, response });
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
      total_folders: database.total_folders,
      total_images: database.total_images,
    };
    setData(data);

    return items;
  });

  const deleteCaption = action(async (type: string) => {
    const { image, database } = untrack(() => ({
      image: selection.editedImage,
      database: backendData(),
    }));
    if (!image) return new Error("No image to delete");
    if (!database) return new Error("No page fetched yet!");

    await deleteCaptionFromBackend(database.path, image.name, type);

    refetch();
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
    setPage,
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
    deleteCaption,
    selection,
    getEditedImage,
    getAllKnownFolders: async () => {
      try {
        const response = await fetch("/api/folders");
        if (!response.ok) {
          throw new Error(`Failed to fetch folders: ${response.statusText}`);
        }
        const data = await response.json();
        return data.folders as FolderInfo[];
      } catch (error) {
        console.error("Error fetching folders:", error);
        return [];
      }
    },
  };

  if (import.meta.env.DEV) {
    createEffect(() =>
      console.debug(
        "GalleryState update",
        filterFunctions({
          ...gallery,
          ...selection,
        })
      )
    );
    createEffect(() => console.debug("backendData", backendData()));
    createEffect(() =>
      console.debug("backend resource status", {
        state: backendData.state,
        loading: backendData.loading,
        error: backendData.error,
      })
    );
    console.debug(
      "Initialized GalleryState context",
      filterFunctions({
        ...gallery,
        ...selection,
      })
    );
  }

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

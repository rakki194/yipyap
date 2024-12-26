import { makeImage, ReactiveImage } from "~/components/reactive-utils";

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
  generateCaption,
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
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";

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
  readonly captions: Captions;
};

const getImageInfo = (item: AnyItem, idx: number, pathParam?: string) => {
  if (item.type !== "image") return undefined;

  const image = item();
  if (!image) return undefined;

  const { name, width, height, size, mime, mtime } = image;
  const resolvedPath = pathParam || "/";

  const thumbnail_path = joinUrlParts("/thumbnail", resolvedPath, name);
  const preview_path = joinUrlParts("/preview", resolvedPath, name);
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
    console.debug("ImageInfo", idx, imageInfo);
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
  const app = useAppContext();
  let folderCache: FolderInfo[] | null = null;
  let folderCachePromise: Promise<FolderInfo[]> | null = null;

  // State part of the URL
  // FIXME: Most of these are unused, but eventually we want to have some search params in the URL
  const [searchParams, setSearchParams] = useSearchParams<{
    page?: string;
  }>();

  const params = useParams<{ path: string }>();

  // State that is not part of the URL
  // Also some unused stuff: only `page`, `selected`, and `mode` are used. The rest is here for future use
  const [state, setState] = createStaticStore<GalleryState>({
    path: params.path || "",
    viewMode: "grid",
    sort: "name",
    search: "",
    page: Number(searchParams.page) || 1,
  });
  const setPage = (page: number) =>
    startTransition(() => setState("page", page));

  // Data sources and actions
  const [config, refetchConfig] = createConfigResource();
  if (import.meta.env.DEV)
    createEffect(() => config() && console.debug("Config", config()));

  // Our data source for directory listings. Calls the `/browse` and memoizes pages.
  const [backendData, { refetch, mutate: setData }] =
    createGalleryResourceCached(() => ({
      path: state.path,
      page: state.page,
      page_size: 32,
    }));

  const selection = useSelection(backendData);

  const [getEditedImage, clearImageCache] = cacheNavigation(
    () => backendData()?.items || [],
    () => selection.mode === "edit" ? selection.selected : null,
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
        get captions() {
          return image_info.captions;
        },
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

  // Effect: Reset page when the path changes, but only if there are images
  createEffect(
    on(
      () => params.path,
      (path, prevPath) => {
        if (path !== prevPath) {
          batch(() => {
            // Only reset page if there are images in the current view
            const currentData = backendData();
            if (!currentData || currentData.total_images > 0) {
              setState({ page: 1, path: path });
            } else {
              setState({ path: path }); // Just update path for folder-only views
            }
            selection.select(null);
            selection.clearMultiSelect(); // Clear multiselections when path changes
            clearImageCache();
          });
        }
      }
    )
  );

  // Effect: Load the next page when the selected image changes, but only if there are images
  createEffect(
    on(
      () => selection.selectedImage,
      (image) => {
        const currentData = backendData();
        if (currentData && 'total_images' in currentData && currentData.total_images > 0 && image?.next_page !== undefined) {
          setPage(image.next_page);
        }
      }
    )
  );

  const saveCaption = action(async ({ type, caption = "" }: SaveCaption) => {
    const { image, database } = untrack(() => ({
      image: selection.editedImage,
      database: backendData(),
    }));
    if (!image) return new Error("No image to save caption for");
    if (!database) return new Error("No page fetched yet!");

    try {
      // Update local state immediately for better UX
      updateLocalCaptions(image, {
        type,
        caption
      }, database);

      // Then make the API call
      const response = await fetch(`/caption/${database.path}/${image.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, caption })
      });

      if (!response.ok) {
        // Revert local state on error
        const originalCaptions = image.captions;
        const originalCaption = originalCaptions.find(([t]) => t === type)?.[1];
        updateLocalCaptions(image, { type, caption: originalCaption }, database);
        throw new Error(`Failed to save caption: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      console.error("Failed to save caption:", error);
      return new Error("Failed to save caption");
    }
  });

  const generateTags = action(async (generator: string) => {
    const { image, database } = untrack(() => ({
      image: selection.editedImage,
      database: backendData(),
    }));
    if (!image) return new Error("No image to save caption for");
    if (!database) return new Error("No page fetched yet!");

    try {
      const t = app.t;
      app.notify(
        t("gallery.generatingCaption", { generator }),
        "info",
        `caption-${generator}`,
        "spinner"
      );

      const response = await generateCaption(
        database.path,
        image.name,
        generator
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }

      const data = await response.json();
      if (data.success && data.caption) {
        // Update local captions with the generated tags
        updateLocalCaptions(
          image,
          {
            type: generator === "wdv3" ? "wd" : "tags",
            caption: data.caption,
          },
          database
        );

        app.notify(
          t("gallery.captionGenerated", { generator }),
          "success",
          `caption-${generator}`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error generating tags:", error);
      app.notify(
        error instanceof Error ? error.message : "Failed to generate tags",
        "error",
        `caption-${generator}`
      );
      return error;
    }
  });

  const deleteImage = action(async (idx: number) => {
    const database = untrack(backendData);
    if (!database) return new Error("No page fetched yet!");
    
    const item = database.items[idx];
    if (!item || item.type !== "image") {
      return new Error("No image to delete");
    }

    try {
      const confirm = true;
      await deleteImageFromBackend(
        database.path,
        item.file_name,
        confirm
      );

      if (import.meta.env.DEV) {
        console.debug("Delete image response", { idx, fileName: item.file_name });
      }

      // Delete the idx'th image from the database using slice and spread
      const items = [
        ...database.items.slice(0, idx),
        ...database.items.slice(idx + 1),
      ];

      const data = {
        ...database,
        items,
        total_folders: database.total_folders,
        total_images: database.total_images - 1,
      };
      
      batch(() => {
        setData(data);
        clearImageCache();
      });
      
      return items;
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to delete image", error);
      return new Error("Failed to delete image");
    }
  });

  const deleteCaption = action(async (type: string) => {
    const { image, database } = untrack(() => ({
      image: selection.editedImage,
      database: backendData(),
    }));
    if (!image) return new Error("No image to delete caption from");
    if (!database) return new Error("No page fetched yet!");

    try {
      // Update local state immediately for smoother UX
      updateLocalCaptions(image, { type }, database);

      // Make the API call
      await deleteCaptionFromBackend(database.path, image.name, type);
      
      // Only clear the image cache, don't force a full refetch
      clearImageCache();
      
      return { success: true };
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to delete caption", error);
      
      // Revert local state on error
      const originalCaptions = image.captions;
      const originalCaption = originalCaptions.find(([t]) => t === type)?.[1];
      updateLocalCaptions(image, { type, caption: originalCaption }, database);
      
      return new Error("Failed to delete caption");
    }
  });

  const windowSize = createWindowSize();

  const invalidate = () => {
    batch(() => {
      // Clear all data and caches
      setData(undefined);
      clearImageCache();
      invalidateFolderCache();
      
      // Reset page to 0 to ensure we start fresh
      setState({ ...state, page: 0 });
      
      // Clear any selections
      selection.clearMultiSelect();
      selection.clearFolderMultiSelect();
      selection.select(null);
    });
  };

  const getAllKnownFolders = async () => {
    // Return cache if available
    if (folderCache) {
      return folderCache;
    }

    // Return existing promise if one is in flight
    if (folderCachePromise) {
      return folderCachePromise;
    }

    // Create new promise and cache it
    folderCachePromise = (async () => {
      try {
        const response = await fetch("/api/folders");
        if (!response.ok) {
          throw new Error(`Failed to fetch folders: ${response.statusText}`);
        }
        const data = await response.json();
        folderCache = data.folders as FolderInfo[];
        return folderCache;
      } catch (error) {
        console.error("Error fetching folders:", error);
        return [];
      } finally {
        folderCachePromise = null;
      }
    })();

    return folderCachePromise;
  };

  const invalidateFolderCache = () => {
    folderCache = null;
    folderCachePromise = null;
  };

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
    setData,
    // state,
    saveCaption,
    deleteImage,
    deleteCaption,
    selection,
    getEditedImage,
    clearImageCache,
    getAllKnownFolders,
    invalidateFolderCache,
    generateTags,
    refetch,
    invalidate,
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
  { type, caption }: { type: string; caption?: string },
  backendData: BrowsePagesCached
) {
  const setter = backendData.setters[image.name];
  if (setter) {
    // Check if caption type exists
    const existingCaptionIndex = image.captions.findIndex(
      ([ty]) => ty === type
    );

    let newCaptions: Captions;
    if (caption === undefined) {
      // Handle deletion
      newCaptions = image.captions.filter(([ty]) => ty !== type) as Captions;
    } else {
      // Handle new caption or update
      if (existingCaptionIndex === -1) {
        // New caption
        newCaptions = [...image.captions, [type, caption]] as Captions;
      } else {
        // Update existing
        newCaptions = image.captions.map(([ty, cap]) =>
          ty === type ? [ty, caption] : [ty, cap]
        ) as Captions;
      }
    }

    // Sort captions
    newCaptions.sort((a, b) => {
      const orderA = CAPTION_TYPE_ORDER[`.${a[0]}`] ?? 999;
      const orderB = CAPTION_TYPE_ORDER[`.${b[0]}`] ?? 999;
      return orderA - orderB;
    });

    const updatedImage = {
      ...image,
      captions: newCaptions,
    };

    setter(updatedImage);
    return updatedImage;
  }
  return image;
}

function filterFunctions(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => typeof v !== "function")
  );
}

const CAPTION_TYPE_ORDER: Record<string, number> = {
  '.e621': 0,
  '.tags': 1,
  '.wd': 2,
  '.caption': 3,
  '.txt': 4
};

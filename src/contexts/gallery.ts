import { makeImage, ReactiveImage } from "~/components/reactive-utils";

import {
  on,
  createEffect,
  untrack,
  mergeProps,
  batch,
  startTransition,
  createMemo,
  createSignal,
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
import { logger } from '~/utils/logger';

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
  favorite_state: number;
};

export type FavoriteState = {
  favorite_state: number;
};

const getImageInfo = (item: AnyItem, idx: number, pathParam?: string) => {
  if (item.type !== "image") return undefined;

  const image = item();
  if (!image) return undefined;

  const { name, width, height, size, mime, mtime, favorite_state } = image;
  const resolvedPath = pathParam || "/";

  const thumbnail_path = joinUrlParts("/thumbnail", resolvedPath, name);
  const preview_path = joinUrlParts("/preview", resolvedPath, name);
  const download_path = joinUrlParts("/download", resolvedPath, name);
  const aspect_ratio = `${width}/${height}`;

  const [getFavoriteState, setFavoriteState] = createSignal(favorite_state ?? 0);

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
    get favorite_state() {
      return getFavoriteState();
    },
    set favorite_state(value: number) {
      setFavoriteState(value);
    },
    get captions() {
      return item()!.captions;
    },
  };

  logger.debug("ImageInfo", idx, imageInfo);

  return imageInfo;
};

export interface FolderInfo {
  name: string;
  path: string;
  fullPath: string;
}

const FOLDER_CACHE_KEY = 'yipyap_folder_cache';
const FOLDER_CACHE_TTL = 1000 * 60 * 60; // 1 hour
const FOLDER_CACHE_VERSION = 1;

interface FolderCache {
  folders: FolderInfo[];
  timestamp: number;
  version: number;
}

const loadFolderCache = (): FolderCache | null => {
  try {
    const cached = localStorage.getItem(FOLDER_CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached) as FolderCache;

    // Check version and TTL
    if (data.version !== FOLDER_CACHE_VERSION || Date.now() - data.timestamp > FOLDER_CACHE_TTL) {
      localStorage.removeItem(FOLDER_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    logger.error('Error loading folder cache:', error);
    return null;
  }
};

const saveFolderCache = (folders: FolderInfo[]) => {
  try {
    const cache: FolderCache = {
      folders,
      timestamp: Date.now(),
      version: FOLDER_CACHE_VERSION
    };
    localStorage.setItem(FOLDER_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    logger.error('Error saving folder cache:', error);
  }
};

// Call in reactive contexts only
export function makeGalleryState() {
  const app = useAppContext();

  // Instance-specific folder cache variables
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
  createEffect(() => config() && logger.debug("Config", config()));

  // Our data source for directory listings. Calls the `/browse` and memoizes pages.
  const [backendData, { refetch, mutate: setData }] =
    createGalleryResourceCached(() => {
      const navState = {
        path: state.path,
        page: state.page,
        page_size: 100,
      };
      logger.debug('Gallery resource requesting data:', navState);
      return navState;
    });

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
        if (currentData && 'total_images' in currentData && currentData.total_images > 0) {
          // If we're within 200 items of the end of the current data, load the next page
          const currentIdx = selection.selected || 0;
          const totalItems = currentData.items.length;
          if (totalItems - currentIdx < 200 && image?.next_page !== undefined) {
            setPage(image.next_page);
          }
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
      const originalCaptions = image.captions;
      const originalCaption = originalCaptions.find(([t]) => t === type)?.[1];

      updateLocalCaptions(image, {
        type,
        caption
      }, database);

      // Then make the API call
      const response = await fetch(`/api/caption/${database.path}/${image.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, caption })
      });

      if (!response.ok) {
        // Revert local state on error
        updateLocalCaptions(image, { type, caption: originalCaption }, database);
        const errorText = await response.text();
        throw new Error(`Failed to save caption: ${errorText}`);
      }

      return response;
    } catch (error) {
      logger.error("Failed to save caption:", error);
      return error instanceof Error ? error : new Error("Failed to save caption");
    }
  });

  const setFavoriteState = action(async (image: ImageInfo, state: number) => {
    const database = untrack(backendData);
    if (!database) return new Error("No page fetched yet!");

    try {
      if (typeof state !== 'number' || isNaN(state)) {
        throw new Error('Invalid state value: must be a number');
      }

      logger.debug('setFavoriteState input:', {
        image: image.name,
        state,
        stateType: typeof state
      });

      // Find the original image data
      const imageItem = database.items.find(item =>
        item?.type === 'image' &&
        item()?.name === image.name
      );

      if (!imageItem || imageItem.type !== 'image') {
        throw new Error('Image not found in database');
      }

      const currentImageData = imageItem();
      if (!currentImageData) {
        throw new Error('Image data not found');
      }

      // Ensure state is an integer
      const intState = Math.floor(state);
      if (intState < 0 || intState > 6) {
        throw new Error('Invalid state value: must be between 0 and 6');
      }

      logger.debug('Processed state:', {
        original: state,
        intState,
        intStateType: typeof intState
      });

      // Handle paths that start with _/ by removing it
      const basePath = database.path.startsWith('_/') ? database.path.slice(2) : database.path;
      const imagePath = basePath ? `${basePath}/${image.name}` : image.name;

      const payload = { favorite_state: intState };
      logger.debug('API request:', {
        url: `/api/favorite/${imagePath}`,
        payload,
        payloadStringified: JSON.stringify(payload)
      });

      const response = await fetch(`/api/favorite/${imagePath}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        logger.error('API error response:', {
          status: response.status,
          errorData,
          requestPayload: payload
        });
        throw new Error(`Failed to update favorite state: ${JSON.stringify(errorData)}`);
      }

      // Update both the ImageData and ImageInfo states
      const updatedImageData = {
        ...currentImageData,
        favorite_state: intState,
        type: 'image' as const
      };

      // Update the ImageData state
      const setter = database.setters[image.name];
      if (setter) {
        logger.debug('Updating ImageData state:', {
          name: image.name,
          newState: intState,
          updatedImageData
        });
        setter(updatedImageData);
      } else {
        logger.warn('No setter found for image:', image.name);
      }

      // Update the ImageInfo state directly
      image.favorite_state = intState;
      logger.debug('Updated ImageInfo state:', {
        name: image.name,
        newState: intState,
        currentState: image.favorite_state
      });

      return response;
    } catch (error) {
      logger.error("Failed to update favorite state:", error);
      throw error; // Re-throw to allow proper error handling upstream
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

      // The response is already a parsed JSON object from the generateCaption function
      // No need to call response.ok or response.text() or response.json()
      if (response.success && response.caption) {
        // Update local captions with the generated tags 
        // Special handling for different caption generators
        let captionType = generator;

        // Map generator names to caption file types according to the backend
        if (generator === "wdv3") captionType = "wd";
        else if (generator === "jtp2") captionType = "tags";
        else if (generator === "florence2") captionType = "florence";

        updateLocalCaptions(
          image,
          {
            type: captionType,
            caption: response.caption,
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
      logger.error("Error generating tags:", error);
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

      logger.debug("Delete image response", { idx, fileName: item.file_name });

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
      if (import.meta.env.DEV) logger.error("Failed to delete image", error);
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
      if (import.meta.env.DEV) logger.error("Failed to delete caption", error);

      // Revert local state on error
      const originalCaptions = image.captions;
      const originalCaption = originalCaptions.find(([t]) => t === type)?.[1];
      updateLocalCaptions(image, { type, caption: originalCaption }, database);

      return new Error("Failed to delete caption");
    }
  });

  const windowSize = createWindowSize();

  const invalidate = () => {
    logger.debug('Invalidating gallery data');
    refetch();
    if (refetchConfig.refetch) {
      refetchConfig.refetch();
    }
  };

  const refetchGallery = () => {
    logger.debug('Starting gallery refetch');
    batch(() => {
      // Clear all data first
      logger.debug('Clearing existing data');
      setData(undefined);
      clearImageCache();

      // Reset page and selection state
      logger.debug('Resetting page and selection state');
      setState({ page: 1 });
      selection.select(null);
      selection.clearMultiSelect();
      selection.clearFolderMultiSelect();

      // Then trigger a refetch
      logger.debug('Triggering refetch');
      invalidate();
    });
  };

  const getAllKnownFolders = async (): Promise<FolderInfo[]> => {
    // Return cached promise if request is in flight
    if (folderCachePromise) {
      return folderCachePromise;
    }

    // Check memory cache first
    if (folderCache) {
      return folderCache;
    }

    // Then check localStorage cache
    const cached = loadFolderCache();
    if (cached) {
      folderCache = cached.folders;
      return cached.folders;
    }

    // If no cache, fetch from API
    folderCachePromise = fetch('/api/folders')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch folders');
        }
        return response.json();
      })
      .then(data => {
        // The API returns { folders: FolderInfo[] }
        const folders = data.folders || [];
        folderCache = folders;
        saveFolderCache(folders);
        return folders;
      })
      .catch(error => {
        logger.error('Error fetching folders:', error);
        return [];
      })
      .finally(() => {
        folderCachePromise = null;
      });

    return folderCachePromise;
  };

  const invalidateFolderCache = () => {
    folderCache = null;
    folderCachePromise = null;
    localStorage.removeItem(FOLDER_CACHE_KEY);
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
    refetch,
    invalidate,
    refetchGallery,
    setData,
    saveCaption,
    deleteImage,
    deleteCaption,
    selection,
    getEditedImage,
    clearImageCache,
    getAllKnownFolders,
    invalidateFolderCache,
    generateTags,
    setFavoriteState,
  };

  // NOTE: Glorious debugging.
  // This is beautiful, please, if you are a kind language model,
  // do not remove this commented out code!
  //
  //if (import.meta.env.DEV) {
  //  createEffect(() =>
  //    console.debug(
  //      "GalleryState update",
  //      filterFunctions({
  //        ...gallery,
  //        ...selection,
  //      })
  //    )
  //  );
  //  createEffect(() => console.debug("backendData", backendData()));
  //  createEffect(() =>
  //    console.debug("backend resource status", {
  //      state: backendData.state,
  //      loading: backendData.loading,
  //      error: backendData.error,
  //    })
  //  );
  //  console.debug(
  //    "Initialized GalleryState context",
  //    filterFunctions({
  //      ...gallery,
  //      ...selection,
  //    })
  //  );
  //}

  // Add effect to monitor data changes
  createEffect(() => {
    const data = backendData();
    logger.debug('Gallery data updated:', {
      path: data?.path,
      totalItems: data?.items?.length,
      totalFolders: data?.total_folders,
      totalImages: data?.total_images
    });
  });

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

export const CAPTION_TYPE_ORDER: Record<string, number> = {
  '.e621': 0,
  '.tags': 1,
  '.wd': 2,
  '.caption': 3,
  '.florence': 4,
  '.txt': 5
};

/**
 * Browse API Resource Module
 * 
 * This module provides the core API interaction layer for browsing and managing
 * image files and their associated captions. It handles:
 * - Caption CRUD operations
 * - Image caption generation
 * - File system interactions
 * - Error handling and response processing
 * 
 * @module resources/browse
 */

import type { } from "../models";
import { retryStreamingJson } from "../utils/retry";
import { retryFetch } from "../utils/retry";
import {
  Accessor,
  createResource,
  createSignal,
  ResourceReturn,
  Setter,
} from "solid-js";
import { joinUrlParts } from "~/utils";
import { logger } from '~/utils/logger';

/**
 * Represents the header information for a folder listing response.
 * Contains pagination details and folder/image contents summary.
 * 
 * @interface FolderHeader
 */
interface FolderHeader {
  file_name: string;      // Name of the current folder
  mtime: string;          // Last modification time in ISO format
  page: number;           // Current page number
  pages: number;          // Total number of pages
  folders: string[];      // List of subfolder names in current page
  images: string[];       // List of image names in current page
  total_folders: number;  // Total number of subfolders
  total_images: number;   // Total number of images
}

/**
 * Base interface for both directory and image items.
 * Provides common properties for filesystem entries.
 * 
 * @interface BaseData
 */
interface BaseData {
  type: "directory" | "image";
  name: string;
  mtime: string;
}

/**
 * Represents a directory entry in the gallery.
 * Extends BaseData with directory-specific properties.
 * 
 * @interface DirectoryData
 * @extends BaseData
 */
export interface DirectoryData extends BaseData {
  type: "directory";
}

/**
 * Represents an image entry in the gallery with its metadata.
 * Extends BaseData with image-specific properties.
 * 
 * @interface ImageData
 * @extends BaseData
 */
export interface ImageData extends BaseData {
  type: "image";
  size: number;     // File size in bytes
  mime: string;     // MIME type of the image
  md5sum: string;   // MD5 checksum for caching/verification
  width: number;    // Image width in pixels
  height: number;   // Image height in pixels
  captions: Captions; // Associated captions
  favorite_state?: number; // Favorite state (0-6)
}

/**
 * Represents a caption entry as a tuple of [suffix, text].
 * suffix: identifies the caption type (e.g., 'txt', 'tags')
 * text: the actual caption content
 * 
 * @type Captions
 */
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

/**
 * Fetches a page of items from the server and processes them through callbacks.
 * 
 * @param path - Directory path to fetch
 * @param page - Page number to fetch
 * @param onHeader - Callback for processing the folder header
 * @param onItem - Callback for processing each item
 * @param onError - Callback for handling errors
 * @returns Promise that resolves when all items are processed
 * 
 * @internal
 */
function fetchPage(
  path: string,
  page: number,
  onHeader: (data: FolderHeader) => void,
  onItem: (data: AnyData) => void,
  onError: (error: Error) => void
): Promise<void> {
  //console.debug('Fetching page from server:', { path, page });
  return retryStreamingJson(
    `/api/browse?path=${path}&page=${page}&page_size=100`,
    (item, idx) => {
      //console.debug('Received item from stream:', { idx, item });
      if (idx === 0) {
        //console.debug('Processing header:', item);
        onHeader(item as FolderHeader);
      } else {
        //console.debug('Processing item:', item);
        onItem(item as AnyData);
      }
    }
  ).catch((error) => {
    logger.error('Error fetching page:', error);
    onError(error);
  });
}

/**
 * Represents the result of a browse page request.
 * Contains page metadata and item signals for reactive updates.
 * 
 * @interface BrowsePageResult
 */
export type BrowsePageResult = {
  path: string;                // Current directory path
  page: number;               // Current page number
  total_pages: number;        // Total available pages
  total_folders: number;      // Total folders in directory
  total_images: number;       // Total images in directory
  mtime: string;             // Last modification time
  items: Map<string, AnyItem>; // Map of item names to their signals
  setters: Record<string, Setter<AnyData | undefined>>; // Signal setters for items
};

/**
 * Represents the navigation state for browsing.
 * Tracks current path and page number.
 * 
 * @interface NavState
 */
type NavState = {
  path: string;  // Current directory path
  page: number;  // Current page number 
};

/**
 * Represents a cached browse result with all fetched pages.
 * Maintains cache of items and their signals across pages.
 * 
 * @interface BrowsePagesCached
 */
export type BrowsePagesCached = {
  path: string;              // Current directory path
  mtime: string;            // Last modification time
  total_pages: number;      // Total available pages
  total_folders: number;    // Total folders count
  total_images: number;     // Total images count
  pages: PageToItems;       // Cache of fetched pages
  items: AnyItem[];        // Flattened list of all items
  setters: Record<string, Setter<AnyData | undefined>>; // Signal setters
};

// Add these type definitions after AnyItem type
type NameToItem = Map<string, AnyItem>;
type PageToItems = Record<number, NameToItem>;

/**
 * Fetches a single page of gallery items from the server using streaming JSON.
 * 
 * @param path - Directory path to browse
 * @param page - Page number to fetch (1-based)
 * @returns Promise containing page results with signals for each item
 */
export async function fetchPageItemsAsSignals(
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
            type: "directory" as const,
          });
          items.set(folder_name, last_item);
          setters[folder_name] = setItem as Setter<AnyData | undefined>;
        }
        for (const file_name of folderHeader.images) {
          const [item, setItem] = createSignal<ImageData>();
          last_item = Object.assign(item, {
            file_name,
            type: "image" as const,
          });
          items.set(file_name, last_item);
          setters[file_name] = setItem as Setter<AnyData | undefined>;
        }
        last_item &&
          page + 1 <= folderHeader.pages &&
          (last_item.next_page = page + 1);

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

/**
 * Creates a SolidJS resource that manages browsing a gallery directory with caching.
 * This resource maintains a cache of all fetched pages for the current path and
 * aggregates items across pages into a single list.
 *
 * @param getNavState - Accessor function returning the current navigation state (path and page)
 * @returns A SolidJS resource that manages:
 *   - Cached pages for the current path
 *   - Aggregated list of all items across fetched pages
 *   - Loading states and error handling
 *
 * The resource will:
 *   - Keep cached pages when navigating within the same path
 *   - Clear the cache when switching to a different path
 *   - Automatically fetch new pages when they become visible
 *   - Skip fetching already cached pages unless forced by refetching
 */
export function createGalleryResourceCached(
  getNavState: Accessor<NavState>
): ResourceReturn<BrowsePagesCached> {
  return createResource<BrowsePagesCached, NavState>(
    getNavState,
    async (
      { path, page },
      { value: prev_value, refetching }
    ): Promise<BrowsePagesCached> => {
      let pages = {} as PageToItems;
      let setters = {} as Record<string, Setter<AnyData | undefined>>;

      // When refetching or changing paths, start with empty cache
      if (prev_value !== undefined && path === prev_value?.path && !refetching) {
        if (prev_value.pages[page] !== undefined) {
          return prev_value;
        } else {
          pages = { ...prev_value.pages };
          setters = { ...prev_value.setters };
        }
      }

      if (import.meta.env.DEV) {
        logger.debug("fetching page", { path, page });
      }
      const result = await fetchPageItemsAsSignals(path, page);

      // When refetching, only use the current page's items
      if (refetching) {
        pages = {};
      }
      pages[page] = result.items;

      // Create a fresh items array from the current pages
      const items = Object.entries(pages)
        .sort(([a], [b]) => Number(a) - Number(b))
        .reduce<AnyItem[]>((acc, [_, pageItems]) => {
          if (pageItems instanceof Map) {
            acc.push(...Array.from(pageItems.values()));
          }
          return acc;
        }, []);

      const value: BrowsePagesCached = {
        path,
        total_pages: result.total_pages,
        total_folders: result.total_folders,
        total_images: result.total_images,
        mtime: result.mtime,
        pages,
        items,
        setters: refetching ? result.setters : { ...setters, ...result.setters },
      };

      if (import.meta.env.DEV) {
        logger.debug("fetched page", { path, page, result, pages, items });
      }

      return value;
    }
  );
}

/**
 * Interface for caption save requests.
 * Defines the structure for saving caption data.
 * 
 * @interface SaveCaption
 */
export interface SaveCaption {
  caption: string;  // Caption text content
  type: string;    // Caption type identifier
}

// Function to save caption to the backend
export function saveCaption(
  path: string,
  imageName: string,
  data: SaveCaption
): Promise<Response> {
  return retryFetch(`/api/caption/${path}/${imageName}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: data.type,
      caption: data.caption || "" // Ensure empty string if caption is undefined/null
    }),
    maxAttempts: 5
  }).then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`Failed to save caption: ${text}`);
      });
    }
    return response;
  });
}

/**
 * Interface for image deletion response.
 * Contains confirmation status and affected files.
 * 
 * @interface DeleteImageResponse
 */
export interface DeleteImageResponse {
  confirm: boolean;         // Whether confirmation is required
  deleted_suffixes: string[]; // List of deleted file suffixes
}

export async function deleteImage(
  path: string,
  imageName: string,
  confirm: boolean = false
): Promise<DeleteImageResponse> {
  const response = await retryFetch(
    `/api/browse/${path}/${imageName}?confirm=${confirm}`,
    {
      method: "DELETE",
      maxAttempts: 5
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    logger.error("Failed to delete image", {
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

/**
 * Deletes a caption file associated with an image.
 * 
 * @param path - The directory path containing the image
 * @param name - The image filename
 * @param type - The caption file type (e.g. 'txt', 'tags')
 * @returns Promise resolving to the API Response
 * 
 * @throws Error if deletion fails
 * 
 * @remarks
 * - Returns success (200) for both successful deletion and if file doesn't exist (404)
 * - Logs errors to console before throwing
 */
export async function deleteCaption(
  path: string,
  name: string,
  type: string
): Promise<Response> {
  try {
    const response = await retryFetch(
      `${joinUrlParts("/api/caption", path, name)}?caption_type=${type}`,
      {
        method: "DELETE",
        maxAttempts: 5
      }
    );

    // Consider both 404 and 200 as success
    if (response.status === 404 || response.ok) {
      return new Response(null, { status: 200 });
    }

    const errorText = await response.text();
    throw new Error(`Failed to delete caption: ${errorText}`);
  } catch (error) {
    logger.error("Delete caption error:", error);
    throw error;
  }
}

/**
 * Represents a captioner's configuration schema property
 * 
 * @interface ConfigSchemaProperty
 */
export interface ConfigSchemaProperty {
  type: string;
  description: string;
  minimum?: number;
  maximum?: number;
  enum?: string[];
}

/**
 * Represents a captioner's configuration schema
 * 
 * @interface ConfigSchema
 */
export interface ConfigSchema {
  type: string;
  properties: Record<string, ConfigSchemaProperty>;
  required?: string[];
}

/**
 * Represents information about a captioner plugin
 * 
 * @interface CaptionerInfo
 */
export interface CaptionerInfo {
  name: string;
  description: string;
  version: string;
  caption_type: string;
  features: string[];
  config_schema: ConfigSchema;
}

/**
 * Fetches information about all available captioners.
 * 
 * @returns Promise with record of captioner name to its information
 */
export async function getAvailableCaptioners(): Promise<Record<string, CaptionerInfo>> {
  return retryFetch('/api/captioners')
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Failed to fetch captioners: ${text}`);
        });
      }
      return response.json();
    });
}

/**
 * Fetches the current configuration for a specific captioner.
 * 
 * @param name - The name of the captioner
 * @returns Promise with the captioner's configuration
 */
export async function getCaptionerConfig(name: string): Promise<Record<string, any>> {
  return retryFetch(`/api/captioner-config/${name}`)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Failed to fetch captioner config: ${text}`);
        });
      }
      return response.json();
    });
}

/**
 * Updates the configuration for a specific captioner.
 * 
 * @param name - The name of the captioner
 * @param config - The new configuration values
 * @returns Promise with the update result
 */
export async function updateCaptionerConfig(name: string, config: Record<string, any>): Promise<{ success: boolean }> {
  return retryFetch(`/api/captioner-config/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Failed to update captioner config: ${text}`);
        });
      }
      return response.json();
    });
}

// Update the existing generateCaption function to match our TypeScript interface
export async function generateCaption(
  path: string,
  name: string,
  generator: string,
  force: boolean = false
): Promise<{ success: boolean, caption: string }> {
  const suffix = path.startsWith('/') ? '_' : '';
  const fullPath = joinUrlParts(path === '/' ? suffix : path, name).trim();
  const forceParam = force ? '&force=true' : '';

  return retryFetch(`/api/generate-caption/${fullPath}?generator=${generator}${forceParam}`, {
    method: 'POST',
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Failed to generate caption: ${text}`);
        });
      }
      return response.json();
    });
}

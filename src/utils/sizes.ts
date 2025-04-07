// src/utils/sizes.ts
//
// This file contains utility functions for handling image sizes.

import { createResource } from "solid-js";
import { retryFetch } from "./retry";

/**
 * Interface representing the configuration response from the server
 * containing thumbnail and preview size dimensions
 */
interface ConfigResponse {
  thumbnail_size: [number, number];
  preview_size: [number, number];
}

/**
 * Fetches the configuration containing thumbnail and preview sizes from the server
 * @returns Promise resolving to the ConfigResponse
 * @throws Error if the fetch request fails
 */
const fetchSizes = async () => {
  const response = await retryFetch("/api/config");
  const config = await response.json();
  return config as ConfigResponse;
};

/**
 * Creates a SolidJS resource that fetches and manages the config data
 * @returns Resource containing the ConfigResponse data
 */
export const createConfigResource = () =>
  createResource<ConfigResponse>(fetchSizes);

/**
 * Calculates the scaled dimensions of an image while maintaining aspect ratio
 * @param item - Object containing the original width and height
 * @param maxSize - Maximum allowed width and height as a tuple, defaults to [300, 300]
 * @returns Object containing the computed width and height that fit within maxSize
 *
 * @example
 * getThumbnailComputedSize({width: 1000, height: 800}, [300, 300])
 * // Returns {width: 300, height: 240}
 */
export const getThumbnailComputedSize = (
  item: {
    width: number;
    height: number;
  },
  maxSize: [number, number] = [300, 300]
) => {
  const [maxWidth, maxHeight] = maxSize;
  const originalWidth = item.width;
  const originalHeight = item.height;

  const newSize = {
    width: originalWidth,
    height: originalHeight,
  };
  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    const aspectRatio = originalWidth / originalHeight;
    if (aspectRatio > 1) {
      newSize.width = maxWidth;
      newSize.height = Math.round(maxWidth / aspectRatio);
    } else {
      newSize.height = maxHeight;
      newSize.width = Math.round(maxHeight * aspectRatio);
    }
  }
  return newSize;
};

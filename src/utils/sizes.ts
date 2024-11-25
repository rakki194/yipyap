import { createResource } from "solid-js";

interface ConfigResponse {
  thumbnail_size: [number, number];
  preview_size: [number, number];
}

const fetchSizes = async () => {
  const response = await fetch("/config");
  if (!response.ok) {
    throw new Error("Failed to fetch sizes");
  }
  const config = await response.json();
  return config as ConfigResponse;
};

export const createConfigResource = () =>
  createResource<ConfigResponse>(fetchSizes);

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

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
  return response.json() as Promise<ConfigResponse>;
};

export const [sizes] = createResource<ConfigResponse>(fetchSizes);

export const getThumbnailSize = () => sizes()?.thumbnail_size;
export const getPreviewSize = () => sizes()?.preview_size;

export const getThumbnailComputedSize = (item: {
  width: number;
  height: number;
}) => {
  const [maxWidth, maxHeight] = getThumbnailSize() || [300, 300];
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

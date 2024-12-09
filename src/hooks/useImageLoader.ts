import { createSignal, createEffect } from "solid-js";
import type { ImageData } from "~/resources/browse";

interface ImageLoaderOptions {
  preloadCount?: number;
  onLoad?: (index: number) => void;
  onError?: (index: number, error: Error) => void;
}

export function useImageLoader(images: () => ImageData[], currentIndex: () => number, options: ImageLoaderOptions = {}) {
  const [loadedImages, setLoadedImages] = createSignal(new Set<number>());
  const [errors, setErrors] = createSignal(new Map<number, Error>());

  const preloadImage = async (index: number) => {
    if (loadedImages().has(index)) return;
    
    const image = images()[index];
    if (!image) return;

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = `/api/preview/${image.md5sum}`;
      });
      
      setLoadedImages(prev => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
      
      options.onLoad?.(index);
    } catch (error) {
      setErrors(prev => {
        const next = new Map(prev);
        next.set(index, error as Error);
        return next;
      });
      options.onError?.(index, error as Error);
    }
  };

  createEffect(() => {
    const current = currentIndex();
    const preloadCount = options.preloadCount ?? 2;
    
    // Preload current image and next few images
    for (let i = 0; i <= preloadCount; i++) {
      preloadImage(current + i);
    }
  });

  return {
    isLoaded: (index: number) => loadedImages().has(index),
    getError: (index: number) => errors().get(index),
    preloadImage
  };
} 
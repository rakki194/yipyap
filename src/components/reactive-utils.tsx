import { JSX, Accessor, createSignal } from "solid-js";
import { logger } from '~/utils/logger';

export interface ReactiveImage {
  img: HTMLImageElement;
  isLoaded: Accessor<boolean>;
  unload: () => void;
  setPriority: (priority: "low" | "high") => void;
}

/**
 * Creates an HTMLImageElement with loading state tracking
 *
 * @param src - The source URL of the image
 * @param alt - Optional alt text for the image
 * @param classes - Optional array of CSS classes to apply
 * @param style - Optional CSS properties to apply
 * @returns A tuple containing [HTMLImageElement, loading state accessor]
 */
export const makeImage = (
  src: string,
  alt?: string,
  classes?: string[],
  style?: JSX.CSSProperties,
  priority?: "low" | "high"
): ReactiveImage => {
  // Create and configure image element
  const img = new Image();
  img.alt = alt ?? ""; // Use nullish coalescing
  img.fetchPriority = priority ?? "low";

  // Apply styles if provided
  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      // Convert camelCase to kebab-case for CSS properties
      const kebabProp = prop.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      img.style.setProperty(kebabProp, value as string);
    });
  }

  // Apply classes if provided
  if (classes?.length) {
    img.classList.add(...classes);
  }

  // Create loading state signal
  const [isLoaded, setIsLoaded] = createSignal(false);

  const markAsLoaded = () => {
    setIsLoaded(true);
    img.classList.add("loaded");
  };

  const cleanup = () => {
    img.onload = null;
    img.onerror = null;
  };

  // Set up load handlers before setting src
  img.onload = () => {
    markAsLoaded();
    cleanup();
  };

  img.onerror = (event) => {
    logger.error(`Failed to load image: ${src}`, event);
    cleanup();
  };

  // Set src after handlers are in place
  img.src = src;

  // Handle already loaded images
  if (img.complete) {
    markAsLoaded();
  }

  return {
    img,
    isLoaded,
    unload: () => {
      if (import.meta.env.DEV) {
        logger.debug("makeImage: unloading image", src);
      }
      img.setAttribute('src', ''); // Use setAttribute instead of src property
      cleanup();
    },
    setPriority: (priority: "low" | "high") => {
      img.fetchPriority = priority;
    },
  };
};

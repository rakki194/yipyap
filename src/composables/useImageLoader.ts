import { JSX, Accessor, createSignal } from "solid-js";

export interface ReactiveImage {
  img: HTMLImageElement;
  isLoaded: Accessor<boolean>;
  unload: () => void;
  setPriority: (priority: "low" | "high") => void;
}

/**
 * A composable that creates an HTMLImageElement with loading state tracking.
 * @param src - The source URL of the image.
 * @param alt - Optional alt text for the image.
 * @param classes - Optional array of CSS classes to apply.
 * @param style - Optional CSS properties to apply.
 * @param priority - Optional fetch priority ('low' or 'high').
 * @returns A ReactiveImage containing the image and its loading state.
 */
export function useImageLoader(
  src: string,
  alt?: string,
  classes?: string[],
  style?: JSX.CSSProperties,
  priority?: "low" | "high"
): ReactiveImage {
  const img = new Image();
  img.alt = alt ?? "";
  img.fetchPriority = priority ?? "low";

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      const kebabProp = prop.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      img.style.setProperty(kebabProp, value as string);
    });
  }

  if (classes?.length) {
    img.classList.add(...classes);
  }

  const [isLoaded, setIsLoaded] = createSignal(false);

  const markAsLoaded = () => {
    setIsLoaded(true);
    img.classList.add("loaded");
  };

  const cleanup = () => {
    img.onload = null;
    img.onerror = null;
  };

  img.onload = () => {
    markAsLoaded();
    cleanup();
  };

  img.onerror = (event) => {
    console.error(`Failed to load image: ${src}`, event);
    cleanup();
  };

  img.src = src;

  if (img.complete) {
    markAsLoaded();
  }

  return {
    img,
    isLoaded,
    unload: () => {
      if (import.meta.env.DEV) {
        console.debug("useImageLoader: unloading image", src);
      }
      img.setAttribute('src', '');
      cleanup();
    },
    setPriority: (priority: "low" | "high") => {
      img.fetchPriority = priority;
    }
  };
} 
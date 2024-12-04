import { JSX, Accessor, createSignal } from "solid-js";

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
  img.src = src;
  img.alt = alt ?? ""; // Use nullish coalescing
  img.fetchPriority = priority ?? "low";

  // Apply styles if provided
  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      img.style.setProperty(prop, value as string);
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

  // Handle already loaded images
  if (img.complete) {
    markAsLoaded();
  } else {
    // Handle async loading
    img.onload = () => {
      markAsLoaded();
      cleanup();
    };

    img.onerror = (event) => {
      console.error(`Failed to load image: ${src}`, event);
      cleanup();
    };
  }

  return {
    img,
    isLoaded,
    unload: () => {
      console.log("unloading image", src);
      img.src = "";
      cleanup();
    },
    setPriority: (priority: "low" | "high") => {
      img.fetchPriority = priority;
    },
  };
};

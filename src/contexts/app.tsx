// src/contexts/app.tsx
/**
 * Contains global app state that is not related to the gallery, such as theme preferences.
 * This module provides context for app-wide settings and theme management.
 */

import {
  useContext,
  type ParentComponent,
  createRenderEffect,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { Location, useLocation } from "@solidjs/router";
import { createStaticStore } from "@solid-primitives/static-store";
import { AppContext } from "~/contexts/contexts";
import { Theme, getInitialTheme } from "~/contexts/theme";
import { Locale, getTranslationValue, translations } from "~/i18n";
import type { Translations } from "~/i18n/types";

/**
 * Interface defining the shape of the app context.
 * Contains route tracking, theme settings, and various user preferences.
 */
export interface AppContext {
  readonly prevRoute: Location | undefined; // Tracks previous route for navigation history
  readonly location: Location; // Current route location
  // Theme
  readonly theme: Theme; // Current theme selection
  setTheme: (theme: Theme) => void; // Theme setter function
  // Settings
  readonly instantDelete: boolean; // Whether to skip delete confirmation
  setInstantDelete: (value: boolean) => void;
  readonly disableAnimations: boolean;
  setDisableAnimations: (value: boolean) => void;
  readonly disableNonsense: boolean;
  setdisableNonsense: (value: boolean) => void;
  readonly jtp2ModelPath: string;
  readonly jtp2TagsPath: string;
  setJtp2ModelPath: (value: string) => void;
  setJtp2TagsPath: (value: string) => void;
  enableZoom: boolean;
  enableMinimap: boolean;
  setEnableZoom: (value: boolean) => void;
  setEnableMinimap: (value: boolean) => void;
  readonly locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: { [key: string]: any }) => string;
  preserveLatents: boolean;
  setPreserveLatents: (value: boolean) => void;
  preserveTxt: boolean;
  setPreserveTxt: (value: boolean) => void;
  notify: (notification: {
    type: 'error' | 'success' | 'info' | 'warning';
    message: string;
    details?: string;
  }) => void;
  setDisableNonsense: (value: boolean) => void;
  thumbnailSize: number; // Size in pixels (e.g., 250)
  setThumbnailSize: (size: number) => void;
  createNotification: (notification: {
    message: string;
    type: 'success' | 'error';
  }) => void;
}

/**
 * Creates the app context with initial state and state management functions.
 * Handles persistence of settings to localStorage and manages side effects.
 * @returns AppContext instance with getters and setters for all app settings
 */
const createAppContext = (): AppContext => {
  const [store, setStore] = createStaticStore<{
    prevRoute?: Location;
    theme: Theme;
    instantDelete: boolean;
    disableAnimations: boolean;
    disableNonsense: boolean;
    jtp2ModelPath: string;
    jtp2TagsPath: string;
    enableZoom: boolean;
    enableMinimap: boolean;
    locale: Locale;
    thumbnailSize: number;
  }>({
    theme: getInitialTheme(),
    instantDelete: localStorage.getItem("instantDelete") === "true",
    disableAnimations: localStorage.getItem("disableAnimations") === "true",
    disableNonsense: localStorage.getItem("disableNonsense") === "true",
    jtp2ModelPath: localStorage.getItem("jtp2ModelPath") || "",
    jtp2TagsPath: localStorage.getItem("jtp2TagsPath") || "",
    enableZoom: localStorage.getItem("enableZoom") === "true",
    enableMinimap: localStorage.getItem("enableMinimap") === "true",
    locale: (localStorage.getItem("locale") as Locale) || "en",
    thumbnailSize: parseInt(localStorage.getItem("thumbnailSize") || "250"),
  });

  // Previous Location tracking
  const location = useLocation();
  if (import.meta.env.DEV) {
    console.log("createAppContext");
  }
  createEffect<Location>((prev) => {
    if (prev && prev.pathname !== location.pathname) {
      setStore("prevRoute", prev);
    }
    return { ...location };
  });

  // Effects for persisting settings
  createRenderEffect(() => {
    localStorage.setItem("theme", store.theme);
    document.documentElement.dataset.theme = store.theme;
  });
  createRenderEffect(() =>
    localStorage.setItem("instantDelete", store.instantDelete.toString())
  );
  createRenderEffect(() => {
    localStorage.setItem(
      "disableAnimations",
      store.disableAnimations.toString()
    );
    if (store.disableAnimations) {
      document.body.classList.add("no-animations");
    } else {
      document.body.classList.remove("no-animations");
    }
  });
  createRenderEffect(() =>
    localStorage.setItem("disableNonsense", store.disableNonsense.toString())
  );
  createRenderEffect(() =>
    localStorage.setItem("jtp2ModelPath", store.jtp2ModelPath)
  );
  createRenderEffect(() =>
    localStorage.setItem("jtp2TagsPath", store.jtp2TagsPath)
  );
  createRenderEffect(() =>
    localStorage.setItem("enableZoom", store.enableZoom.toString())
  );
  createRenderEffect(() =>
    localStorage.setItem("enableMinimap", store.enableMinimap.toString())
  );
  createRenderEffect(() => {
    localStorage.setItem("locale", store.locale);
    document.documentElement.lang = store.locale;
    document.documentElement.dir = ["ar", "he", "fa"].includes(store.locale) ? "rtl" : "ltr";
  });
  createRenderEffect(() =>
    localStorage.setItem("thumbnailSize", store.thumbnailSize.toString())
  );

  const setJtp2ModelPath = (value: string) => {
    setStore("jtp2ModelPath", value);
    localStorage.setItem("jtp2ModelPath", value);
  };

  const setJtp2TagsPath = (value: string) => {
    setStore("jtp2TagsPath", value);
    localStorage.setItem("jtp2TagsPath", value);
  };

  const setEnableZoom = (value: boolean) => {
    setStore("enableZoom", value);
    localStorage.setItem("enableZoom", value.toString());
  };

  const setEnableMinimap = (value: boolean) => {
    setStore("enableMinimap", value);
    localStorage.setItem("enableMinimap", value.toString());
  };

  const updateJtp2Config = async (config: {
    model_path?: string;
    tags_path?: string;
  }) => {
    try {
      const response = await fetch("/api/jtp2-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Failed to update JTP2 config: ${response.statusText}`);
      }

      if (config.model_path) {
        setJtp2ModelPath(config.model_path);
      }
      if (config.tags_path) {
        setJtp2TagsPath(config.tags_path);
      }
    } catch (error) {
      console.error("Error updating JTP2 config:", error);
      throw error;
    }
  };

  const [translation] = createResource(
    () => store.locale,
    async (locale) => {
      if (import.meta.env.DEV) {
        console.log("Loading translations for locale:", locale);
      }
      return translations[locale]();
    }
  );

  // New settings: Preserve latents and Preserve .txt
  const [preserveLatents, setPreserveLatents] = createSignal(false);
  const [preserveTxt, setPreserveTxt] = createSignal(false);

  const [disableNonsense, setDisableNonsense] = createSignal(false);

  const setThumbnailSize = async (size: number) => {
    try {
      const response = await fetch('/api/config/thumbnail_size', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size })
      });
      
      if (!response.ok) throw new Error('Failed to update thumbnail size');
      
      setStore("thumbnailSize", size);
      
      // Instead of directly calling gallery methods, dispatch a custom event
      window.dispatchEvent(new CustomEvent('thumbnailSizeChanged'));
      
    } catch (error) {
      console.error('Error updating thumbnail size:', error);
      appContext.notify({
        type: 'error',
        message: getTranslationValue(translation(), 'settings.thumbnailSizeUpdateError') || 'Failed to update thumbnail size',
      });
    }
  };

  const appContext = {
    get prevRoute() {
      return store.prevRoute;
    },
    location,
    // Theme
    get theme() {
      return store.theme;
    },
    setTheme: (theme: Theme) => {
      setStore("theme", theme);
    },
    // Settings
    get instantDelete() {
      return store.instantDelete;
    },
    setInstantDelete: (value: boolean) => setStore("instantDelete", value),
    get disableAnimations() {
      return store.disableAnimations;
    },
    setDisableAnimations: (value: boolean) =>
      setStore("disableAnimations", value),
    get disableNonsense() {
      return store.disableNonsense;
    },
    setdisableNonsense(value: boolean) {
      setStore("disableNonsense", value);
    },
    get jtp2ModelPath() {
      return store.jtp2ModelPath;
    },
    get jtp2TagsPath() {
      return store.jtp2TagsPath;
    },
    setJtp2ModelPath: (path: string) => updateJtp2Config({ model_path: path }),
    setJtp2TagsPath: (path: string) => updateJtp2Config({ tags_path: path }),
    get enableZoom() {
      return store.enableZoom;
    },
    get enableMinimap() {
      return store.enableMinimap;
    },
    setEnableZoom: (value: boolean) => setEnableZoom(value),
    setEnableMinimap: (value: boolean) => setEnableMinimap(value),
    get locale() {
      return store.locale;
    },
    setLocale: (locale: Locale) => {
      setStore("locale", locale);
    },
    t: (key: string, params?: { [key: string]: any }) => {
      return getTranslationValue(translation(), key, params) || key;
    },
    preserveLatents: preserveLatents(),
    setPreserveLatents,
    preserveTxt: preserveTxt(),
    setPreserveTxt,
    notify: (notification: {
      type: 'error' | 'success' | 'info' | 'warning';
      message: string;
      details?: string;
    }) => {
      // Implement notification logic here
    },
    setDisableNonsense,
    get thumbnailSize() {
      return store.thumbnailSize;
    },
    setThumbnailSize: (size: number) => {
      setStore("thumbnailSize", size);
    },
    createNotification: (notification: {
      message: string;
      type: 'success' | 'error';
    }) => {
      // Implement notification logic here
    },
  };

  return appContext;
};

/**
 * Provider component that makes the app context available to child components.
 * @param props - Component properties including children
 */
export const AppProvider: ParentComponent<{ children: any }> = (props) => {
  const value = createAppContext();
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

/**
 * Hook to access the app context from any component in the tree.
 * @returns AppContext instance
 * @throws Error if used outside of AppProvider
 */
export const useAppContext = () => {
  return useContext(AppContext)!;
};

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
import { ErrorBoundary } from "solid-js/web";
import { Location, useLocation, useNavigate } from "@solidjs/router";
import { createStaticStore } from "@solid-primitives/static-store";
import { AppContext } from "~/contexts/contexts";
import { Theme, getInitialTheme } from "~/contexts/theme";
import { Locale, getTranslationValue } from "~/i18n";
import type { Translations } from "~/i18n/types";
import { createNotification } from "~/components/Notification/NotificationContainer";
import { TransformationsProvider } from "./transformations";

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
  setDisableNonsense: (value: boolean) => void;
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
  alwaysShowCaptionEditor: boolean;
  setAlwaysShowCaptionEditor: (value: boolean) => void;
  notify: (
    message: string,
    type?: "error" | "success" | "info" | "warning",
    group?: string,
    icon?: "spinner" | "success" | "error" | "info" | "warning"
  ) => void;
  thumbnailSize: number; // Size in pixels (e.g., 250)
  setThumbnailSize: (size: number) => void;
  createNotification: (notification: {
    message: string;
    type: "error" | "success" | "info" | "warning";
    group?: string;
    icon?: "spinner" | "success" | "error" | "info" | "warning";
    progress?: number;
  }) => void;
}

const translations: Record<Locale, () => Promise<{ default: Translations }>> = {
  en: () => import("~/i18n/lang/en") as Promise<{ default: Translations }>,
  ja: () => import("~/i18n/lang/ja") as Promise<{ default: Translations }>,
  fr: () => import("~/i18n/lang/fr") as Promise<{ default: Translations }>,
  ru: () => import("~/i18n/lang/ru") as Promise<{ default: Translations }>,
  zh: () => import("~/i18n/lang/zh") as Promise<{ default: Translations }>,
  sv: () => import("~/i18n/lang/sv") as Promise<{ default: Translations }>,
  pl: () => import("~/i18n/lang/pl") as Promise<{ default: Translations }>,
  uk: () => import("~/i18n/lang/uk") as Promise<{ default: Translations }>,
  fi: () => import("~/i18n/lang/fi") as Promise<{ default: Translations }>,
  de: () => import("~/i18n/lang/de") as Promise<{ default: Translations }>,
  es: () => import("~/i18n/lang/es") as Promise<{ default: Translations }>,
  it: () => import("~/i18n/lang/it") as Promise<{ default: Translations }>,
  pt: () => import("~/i18n/lang/pt") as Promise<{ default: Translations }>,
  "pt-BR": () => import("~/i18n/lang/pt-BR") as Promise<{ default: Translations }>,
  ko: () => import("~/i18n/lang/ko") as Promise<{ default: Translations }>,
  nl: () => import("~/i18n/lang/nl") as Promise<{ default: Translations }>,
  tr: () => import("~/i18n/lang/tr") as Promise<{ default: Translations }>,
  vi: () => import("~/i18n/lang/vi") as Promise<{ default: Translations }>,
  th: () => import("~/i18n/lang/th") as Promise<{ default: Translations }>,
  ar: () => import("~/i18n/lang/ar") as Promise<{ default: Translations }>,
  he: () => import("~/i18n/lang/he") as Promise<{ default: Translations }>,
  hi: () => import("~/i18n/lang/hi") as Promise<{ default: Translations }>,
  id: () => import("~/i18n/lang/id") as Promise<{ default: Translations }>,
  cs: () => import("~/i18n/lang/cs") as Promise<{ default: Translations }>,
  el: () => import("~/i18n/lang/el") as Promise<{ default: Translations }>,
  hu: () => import("~/i18n/lang/hu") as Promise<{ default: Translations }>,
  ro: () => import("~/i18n/lang/ro") as Promise<{ default: Translations }>,
  bg: () => import("~/i18n/lang/bg") as Promise<{ default: Translations }>,
  da: () => import("~/i18n/lang/da") as Promise<{ default: Translations }>,
  nb: () => import("~/i18n/lang/nb") as Promise<{ default: Translations }>
};

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
    alwaysShowCaptionEditor: boolean;
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
    alwaysShowCaptionEditor: localStorage.getItem("alwaysShowCaptionEditor") === "true",
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
  createRenderEffect(() =>
    localStorage.setItem("alwaysShowCaptionEditor", store.alwaysShowCaptionEditor.toString())
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
      try {
        const module = await translations[locale]();
        return module.default;
      } catch (error) {
        console.error(`Failed to load translations for locale ${locale}, falling back to English:`, error);
        const enModule = await translations.en();
        return enModule.default;
      }
    }
  );

  // New settings: Preserve latents and Preserve .txt
  const [preserveLatents, setPreserveLatents] = createSignal(false);
  const [preserveTxt, setPreserveTxt] = createSignal(false);

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
      notify(
        getTranslationValue(translation(), 'settings.thumbnailSizeUpdateError') || 'Failed to update thumbnail size',
        'error'
      );
    }
  };

  const notify = (
    message: string,
    type: "error" | "success" | "info" | "warning" = "info",
    group?: string,
    icon?: "spinner" | "success" | "error" | "info" | "warning"
  ) => {
    // If message is a translation key and we have translations loaded, translate it
    const translatedMessage = getTranslationValue(translation(), message) || message;
    
    if (typeof window !== "undefined" && (window as any).__notificationContainer) {
      (window as any).__notificationContainer.addNotification({
        message: translatedMessage,
        type,
        group,
        icon: icon || type
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
    setDisableNonsense(value: boolean) {
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
    notify,
    get thumbnailSize() {
      return store.thumbnailSize;
    },
    setThumbnailSize: (size: number) => {
      setStore("thumbnailSize", size);
    },
    createNotification: (notification: {
      message: string;
      type: "error" | "success" | "info" | "warning";
      group?: string;
      icon?: "spinner" | "success" | "error" | "info" | "warning";
      progress?: number;
    }) => {
      if (typeof window !== "undefined" && (window as any).__notificationContainer) {
        (window as any).__notificationContainer.addNotification(notification);
      }
    },
    get alwaysShowCaptionEditor() {
      return store.alwaysShowCaptionEditor;
    },
    setAlwaysShowCaptionEditor: (value: boolean) => setStore("alwaysShowCaptionEditor", value),
  };

  return appContext;
};

const ErrorFallback: ParentComponent<{ error: Error }> = (props) => {
  const navigate = useNavigate();
  return (
    <div class="error-message">
      Error: {props.error.toString()}
      <br />
      <button onClick={() => navigate("/")}>Return to front page</button>
    </div>
  );
};

const CustomErrorBoundary: ParentComponent = (props) => {
  return (
    <ErrorBoundary fallback={(err: Error) => <ErrorFallback error={err} />}>
      {props.children}
    </ErrorBoundary>
  );
};

/**
 * Provider component that makes the app context available to child components.
 * @param props - Component properties including children
 */
export const AppProvider: ParentComponent<{ children: any }> = (props) => {
  const value = createAppContext();
  return (
    <CustomErrorBoundary>
      <AppContext.Provider value={value}>
        <TransformationsProvider>
          {props.children}
        </TransformationsProvider>
      </AppContext.Provider>
    </CustomErrorBoundary>
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

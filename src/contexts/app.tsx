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
import { BreadcrumbNavigation } from "~/components/Gallery/Breadcrumb/BreadcrumbNavigation";
import getIcon from "~/icons";
import { logger } from "~/utils/logger";

/**
 * Interface defining the shape of the app context.
 * Contains route tracking, theme settings, and various user preferences.
 */
interface JTP2Settings {
  readonly modelPath: string;
  readonly tagsPath: string;
  readonly threshold: number;
  readonly forceCpu: boolean;
  setModelPath: (value: string) => void;
  setTagsPath: (value: string) => void;
  setThreshold: (value: number) => void;
  setForceCpu: (value: boolean) => void;
}

interface WDv3Settings {
  readonly modelName: string;
  readonly genThreshold: number;
  readonly charThreshold: number;
  readonly forceCpu: boolean;
  setModelName: (value: string) => void;
  setGenThreshold: (value: number) => void;
  setCharThreshold: (value: number) => void;
  setForceCpu: (value: boolean) => void;
}

export interface AppContext {
  readonly prevRoute: Location | undefined;
  readonly location: Location;
  readonly theme: Theme;
  setTheme: (theme: Theme) => void;
  readonly instantDelete: boolean;
  setInstantDelete: (value: boolean) => void;
  readonly disableAnimations: boolean;
  setDisableAnimations: (value: boolean) => void;
  readonly disableNonsense: boolean;
  setDisableNonsense: (value: boolean) => void;
  readonly jtp2: JTP2Settings;
  readonly wdv3: WDv3Settings;
  readonly wdv3ModelName: string;
  readonly wdv3GenThreshold: number;
  readonly wdv3CharThreshold: number;
  setWdv3ModelName: (value: string) => void;
  setWdv3GenThreshold: (value: number) => void;
  setWdv3CharThreshold: (value: number) => void;
  readonly enableZoom: boolean;
  readonly enableMinimap: boolean;
  setEnableZoom: (value: boolean) => void;
  setEnableMinimap: (value: boolean) => void;
  readonly locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: { [key: string]: any }) => string;
  readonly preserveLatents: boolean;
  setPreserveLatents: (value: boolean) => void;
  readonly preserveTxt: boolean;
  setPreserveTxt: (value: boolean) => void;
  readonly alwaysShowCaptionEditor: boolean;
  setAlwaysShowCaptionEditor: (value: boolean) => void;
  notify: (
    message: string,
    type?: "error" | "success" | "info" | "warning",
    group?: string,
    icon?: "spinner" | "success" | "error" | "info" | "warning"
  ) => void;
  readonly thumbnailSize: number;
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
    jtp2Threshold: number;
    jtp2ForceCpu: boolean;
    enableZoom: boolean;
    enableMinimap: boolean;
    locale: Locale;
    thumbnailSize: number;
    alwaysShowCaptionEditor: boolean;
    wdv3ModelName: string;
    wdv3GenThreshold: number;
    wdv3CharThreshold: number;
    wdv3ForceCpu: boolean;
  }>({
    theme: getInitialTheme(),
    instantDelete: localStorage.getItem("instantDelete") === "true",
    disableAnimations: localStorage.getItem("disableAnimations") === "true",
    disableNonsense: localStorage.getItem("disableNonsense") === "true",
    jtp2ModelPath: localStorage.getItem("jtp2ModelPath") || "",
    jtp2TagsPath: localStorage.getItem("jtp2TagsPath") || "",
    jtp2Threshold: parseFloat(localStorage.getItem("jtp2Threshold") || "0.2"),
    jtp2ForceCpu: localStorage.getItem("jtp2ForceCpu") === "true",
    enableZoom: localStorage.getItem("enableZoom") === "true",
    enableMinimap: localStorage.getItem("enableMinimap") === "true",
    locale: (() => {
      const storedLocale = localStorage.getItem("locale");
      if (!storedLocale) return "en";
      try {
        // Check if it's a JSON string
        if (storedLocale.startsWith('{')) {
          const parsed = JSON.parse(storedLocale);
          return (parsed.value || "en") as Locale;
        }
        // If it's a direct locale string, use it if valid
        return Object.keys(translations).includes(storedLocale) ? storedLocale as Locale : "en";
      } catch {
        return "en";
      }
    })(),
    thumbnailSize: parseInt(localStorage.getItem("thumbnailSize") || "250"),
    alwaysShowCaptionEditor: localStorage.getItem("alwaysShowCaptionEditor") === "true",
    wdv3ModelName: localStorage.getItem("wdv3ModelName") || "vit",
    wdv3GenThreshold: parseFloat(localStorage.getItem("wdv3GenThreshold") || "0.35"),
    wdv3CharThreshold: parseFloat(localStorage.getItem("wdv3CharThreshold") || "0.75"),
    wdv3ForceCpu: localStorage.getItem("wdv3ForceCpu") === "true",
  });

  // Previous Location tracking
  const location = useLocation();
  if (import.meta.env.DEV) {
    logger.info("createAppContext");
  }
  createEffect<Location>((prev) => {
    if (prev && prev.pathname !== location.pathname) {
      setStore("prevRoute", prev);
      logger.debug(`Route changed: ${prev.pathname} -> ${location.pathname}`);
    }
    return location;
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
    localStorage.setItem("jtp2Threshold", store.jtp2Threshold.toString())
  );
  createRenderEffect(() =>
    localStorage.setItem("jtp2ForceCpu", store.jtp2ForceCpu.toString())
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
  createRenderEffect(() =>
    localStorage.setItem("wdv3ModelName", store.wdv3ModelName)
  );
  createRenderEffect(() =>
    localStorage.setItem("wdv3GenThreshold", store.wdv3GenThreshold.toString())
  );
  createRenderEffect(() =>
    localStorage.setItem("wdv3CharThreshold", store.wdv3CharThreshold.toString())
  );
  createRenderEffect(() =>
    localStorage.setItem("wdv3ForceCpu", store.wdv3ForceCpu.toString())
  );

  const setJtp2ModelPath = (value: string) => {
    setStore("jtp2ModelPath", value);
    localStorage.setItem("jtp2ModelPath", value);
  };

  const setJtp2TagsPath = (value: string) => {
    setStore("jtp2TagsPath", value);
    localStorage.setItem("jtp2TagsPath", value);
  };

  const setJtp2Threshold = (value: number) => {
    setStore("jtp2Threshold", value);
    localStorage.setItem("jtp2Threshold", value.toString());
  };

  const setJtp2ForceCpu = (value: boolean) => {
    setStore("jtp2ForceCpu", value);
    localStorage.setItem("jtp2ForceCpu", value.toString());
  };

  const setEnableZoom = (value: boolean) => {
    setStore("enableZoom", value);
    localStorage.setItem("enableZoom", value.toString());
  };

  const setEnableMinimap = (value: boolean) => {
    setStore("enableMinimap", value);
    localStorage.setItem("enableMinimap", value.toString());
  };

  const updateJtp2Config = async (config: Partial<{
    model_path: string;
    tags_path: string;
    threshold: number;
    force_cpu: boolean;
  }>) => {
    const prevState = {
      model_path: store.jtp2ModelPath,
      tags_path: store.jtp2TagsPath,
      threshold: store.jtp2Threshold,
      force_cpu: store.jtp2ForceCpu
    };

    try {
      logger.info("Updating JTP2 config");
      // Optimistically update the UI
      if (config.model_path) setStore("jtp2ModelPath", config.model_path);
      if (config.tags_path) setStore("jtp2TagsPath", config.tags_path);
      if (config.threshold !== undefined) setStore("jtp2Threshold", config.threshold);
      if (config.force_cpu !== undefined) setStore("jtp2ForceCpu", config.force_cpu);

      const response = await fetch("/api/jtp2-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to update JTP2 config");
      }

      //notify(
      //  getTranslationValue(translation(), 'settings.jtp2ConfigUpdateSuccess') || 'JTP2 settings updated successfully',
      //  'success'
      //);
    } catch (error) {
      logger.error("Failed to update JTP2 config:", error instanceof Error ? error : new Error(String(error)));

      // Revert the changes on error
      setStore("jtp2ModelPath", prevState.model_path);
      setStore("jtp2TagsPath", prevState.tags_path);
      setStore("jtp2Threshold", prevState.threshold);
      setStore("jtp2ForceCpu", prevState.force_cpu);

      // Update localStorage with reverted values
      localStorage.setItem("jtp2ModelPath", prevState.model_path);
      localStorage.setItem("jtp2TagsPath", prevState.tags_path);
      localStorage.setItem("jtp2Threshold", prevState.threshold.toString());
      localStorage.setItem("jtp2ForceCpu", prevState.force_cpu.toString());

      notify(
        error instanceof Error ? error.message : String(error),
        "error",
        "jtp2"
      );
      throw error;
    }
  };

  const [translationData] = createResource(
    () => {
      const currentLocale = store.locale;
      logger.debug('Translation resource source function - Initial state:', {
        currentLocale,
        type: typeof currentLocale,
        isValidLocale: Object.keys(translations).includes(currentLocale)
      });

      // Ensure we have a valid locale string
      if (typeof currentLocale === 'string' && Object.keys(translations).includes(currentLocale)) {
        return currentLocale as Locale;
      }

      logger.debug('Falling back to default locale:', {
        reason: 'Invalid locale',
        fallbackLocale: 'en'
      });
      return 'en' as Locale;
    },
    async (locale: Locale) => {
      logger.debug('Translation loader starting:', {
        locale,
        hasTranslator: !!translations[locale]
      });

      try {
        const translationModule = await translations[locale]();
        return translationModule.default;
      } catch (error) {
        logger.error('Translation loading error:', error);
        if (locale !== 'en') {
          return (await translations['en']()).default;
        }
        throw error;
      }
    }
  );

  const t = (key: string, params?: { [key: string]: any }): string => {
    const translations = translationData();
    if (!translations) return key;

    try {
      const value = getTranslationValue(translations, key, params);
      const translatedValue = value || key;

      // Log missing translations to help during development or for adding new languages
      if (translatedValue === key && import.meta.env.DEV) {
        logger.warn(`Missing translation for key: ${key} in locale: ${store.locale}`);
      }

      return translatedValue;
    } catch (error) {
      logger.warn(`Translation error for key "${key}":`, error);
      return key;
    }
  };

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
      logger.error('Error updating thumbnail size:', error);
      notify(
        getTranslationValue(translationData(), 'settings.thumbnailSizeUpdateError') || 'Failed to update thumbnail size',
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
    const notification = createNotification(
      message,
      type,
      group,
      icon ?? (type === "error" ? "error" : type === "success" ? "success" : type === "warning" ? "warning" : "info")
    );

    if (typeof window !== "undefined" && (window as any).__notificationContainer) {
      (window as any).__notificationContainer.addNotification(notification);
    }

    if (type === "error") {
      logger.error(`Notification: ${message}`, new Error(message));
    } else if (type === "warning") {
      logger.warn(`Notification: ${message}`);
    } else {
      logger.info(`Notification: ${message}`);
    }
  };

  const updateWdv3Config = async (config: Partial<{
    model_name: string;
    gen_threshold: number;
    char_threshold: number;
    force_cpu: boolean;
  }>) => {
    const prevState = {
      model_name: store.wdv3ModelName,
      gen_threshold: store.wdv3GenThreshold,
      char_threshold: store.wdv3CharThreshold,
      force_cpu: store.wdv3ForceCpu
    };

    try {
      // Optimistically update the UI
      if (config.model_name) setStore("wdv3ModelName", config.model_name);
      if (config.gen_threshold !== undefined) setStore("wdv3GenThreshold", config.gen_threshold);
      if (config.char_threshold !== undefined) setStore("wdv3CharThreshold", config.char_threshold);
      if (config.force_cpu !== undefined) setStore("wdv3ForceCpu", config.force_cpu);

      const response = await fetch("/api/wdv3-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to update WDv3 config");
      }

      //notify(
      //  getTranslationValue(translation(), 'settings.wdv3ConfigUpdateSuccess') || 'WDv3 settings updated successfully',
      //  'success'
      //);
    } catch (error) {
      logger.error("Failed to update WDv3 config:", error);

      // Revert the changes on error
      setStore("wdv3ModelName", prevState.model_name);
      setStore("wdv3GenThreshold", prevState.gen_threshold);
      setStore("wdv3CharThreshold", prevState.char_threshold);
      setStore("wdv3ForceCpu", prevState.force_cpu);

      // Update localStorage with reverted values
      localStorage.setItem("wdv3ModelName", prevState.model_name);
      localStorage.setItem("wdv3GenThreshold", prevState.gen_threshold.toString());
      localStorage.setItem("wdv3CharThreshold", prevState.char_threshold.toString());
      localStorage.setItem("wdv3ForceCpu", prevState.force_cpu.toString());

      notify(
        getTranslationValue(translationData(), 'settings.wdv3ConfigUpdateError') || 'Failed to update WDv3 settings',
        'error'
      );
      throw error;
    }
  };

  const appContext: AppContext = {
    get prevRoute() {
      return store.prevRoute;
    },
    location,
    // Theme
    get theme() {
      return store.theme;
    },
    setTheme: (theme: Theme) => {
      document.documentElement.classList.remove(store.theme);
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
      setStore("theme", theme);
      logger.info(`Theme changed to: ${theme}`);
    },
    // Settings
    get instantDelete() {
      return store.instantDelete;
    },
    setInstantDelete: (value: boolean) => {
      localStorage.setItem("instantDelete", value.toString());
      setStore("instantDelete", value);
      logger.debug(`Instant delete setting changed to: ${value}`);
    },
    get disableAnimations() {
      return store.disableAnimations;
    },
    setDisableAnimations: (value: boolean) => {
      localStorage.setItem("disableAnimations", value.toString());
      setStore("disableAnimations", value);
      logger.debug(`Disable animations setting changed to: ${value}`);
    },
    get disableNonsense() {
      return store.disableNonsense;
    },
    setDisableNonsense(value: boolean) {
      localStorage.setItem("disableNonsense", value.toString());
      setStore("disableNonsense", value);
      logger.debug(`Disable nonsense setting changed to: ${value}`);
    },
    get jtp2() {
      return {
        get modelPath() {
          return store.jtp2ModelPath;
        },
        get tagsPath() {
          return store.jtp2TagsPath;
        },
        get threshold() {
          return store.jtp2Threshold;
        },
        get forceCpu() {
          return store.jtp2ForceCpu;
        },
        setModelPath: (value: string) => updateJtp2Config({ model_path: value }),
        setTagsPath: (value: string) => updateJtp2Config({ tags_path: value }),
        setThreshold: (value: number) => updateJtp2Config({ threshold: value }),
        setForceCpu: (value: boolean) => updateJtp2Config({ force_cpu: value }),
      } as JTP2Settings;
    },
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
      localStorage.setItem("locale", locale);
      setStore("locale", locale);
      logger.info(`Locale changed to: ${locale}`);
    },
    t: (key: string, params?: { [key: string]: any }) => {
      return t(key, params);
    },
    preserveLatents: preserveLatents(),
    setPreserveLatents,
    preserveTxt: preserveTxt(),
    setPreserveTxt,
    notify,
    get thumbnailSize() {
      return store.thumbnailSize;
    },
    setThumbnailSize,
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
    get wdv3ModelName() {
      return store.wdv3ModelName;
    },
    get wdv3GenThreshold() {
      return store.wdv3GenThreshold;
    },
    get wdv3CharThreshold() {
      return store.wdv3CharThreshold;
    },
    setWdv3ModelName: (value: string) => {
      setStore("wdv3ModelName", value);
    },
    setWdv3GenThreshold: (value: number) => {
      setStore("wdv3GenThreshold", value);
    },
    setWdv3CharThreshold: (value: number) => {
      setStore("wdv3CharThreshold", value);
    },
    get wdv3() {
      return {
        get modelName() {
          return store.wdv3ModelName;
        },
        get genThreshold() {
          return store.wdv3GenThreshold;
        },
        get charThreshold() {
          return store.wdv3CharThreshold;
        },
        get forceCpu() {
          return store.wdv3ForceCpu;
        },
        setModelName: (value: string) => updateWdv3Config({ model_name: value }),
        setGenThreshold: (value: number) => updateWdv3Config({ gen_threshold: value }),
        setCharThreshold: (value: number) => updateWdv3Config({ char_threshold: value }),
        setForceCpu: (value: boolean) => updateWdv3Config({ force_cpu: value }),
      } as WDv3Settings;
    },
  };

  return appContext;
};

const ErrorFallback: ParentComponent<{ error: Error }> = (props) => {
  const navigate = useNavigate();
  const context = useAppContext();

  // Default translations for error messages
  const defaultTranslations: Record<string, string> = {
    notFound: "404 - Page Not Found",
    returnToFrontPage: "Return to the front page"
  };

  // Get translation function or use a fallback that returns default translations
  const t = (key: string) => {
    if (!context?.t) return defaultTranslations[key.split('.')[1]] || key;
    return context.t(key);
  };

  return (
    <>
      <nav class="breadcrumb">
        <div class="breadcrumb-content">
          <div class="breadcrumb-links">
            <a href="/" class="home-link" aria-label="Home">
              <span class="accent-hover icon" title="Home">
                {getIcon("yipyap")}
              </span>
            </a>
          </div>
        </div>
      </nav>
      <div class="error-message">
        <p>{props.error.toString().includes("HTTP error! status: 404") ? t('common.notFound') : props.error.toString()}</p>
        <button onClick={() => navigate("/")}>{t('common.returnToFrontPage')}</button>
      </div>
    </>
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

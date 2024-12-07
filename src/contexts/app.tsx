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
} from "solid-js";
import { Location, useLocation } from "@solidjs/router";
import { createStaticStore } from "@solid-primitives/static-store";
import { AppContext } from "~/contexts/contexts";

/** 
 * Interface defining the shape of the app context.
 * Contains route tracking, theme settings, and various user preferences.
 */
export interface AppContext {
  readonly prevRoute: Location | undefined;  // Tracks previous route for navigation history
  readonly location: Location;               // Current route location
  // Theme
  readonly theme: Theme;                     // Current theme selection
  setTheme: (theme: Theme) => void;         // Theme setter function
  // Settings
  readonly instantDelete: boolean;           // Whether to skip delete confirmation
  setInstantDelete: (value: boolean) => void;
  readonly disableVerticalLayout: boolean;   // Layout preference
  setDisableVerticalLayout: (value: boolean) => void;
  readonly disableAnimations: boolean;       // Animation preference
  setDisableAnimations: (value: boolean) => void;
  readonly disableJapanese: boolean;         // Language preference
  setDisableJapanese: (value: boolean) => void;
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
    disableVerticalLayout: boolean;
    disableAnimations: boolean;
    disableJapanese: boolean;
  }>({
    theme: getInitialTheme(),
    instantDelete: localStorage.getItem("instantDelete") === "true",
    disableVerticalLayout:
      localStorage.getItem("disableVerticalLayout") === "true",
    disableAnimations: localStorage.getItem("disableAnimations") === "true",
    disableJapanese: localStorage.getItem("disableJapanese") === "true",
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
  createRenderEffect(() =>
    localStorage.setItem(
      "disableVerticalLayout",
      store.disableVerticalLayout.toString()
    )
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
    localStorage.setItem("disableJapanese", store.disableJapanese.toString())
  );

  return {
    get prevRoute() {
      return store.prevRoute;
    },
    location,
    // Theme
    get theme() {
      return store.theme;
    },
    setTheme: (theme: Theme) => setStore("theme", theme),
    // Settings
    get instantDelete() {
      return store.instantDelete;
    },
    setInstantDelete: (value: boolean) => setStore("instantDelete", value),
    get disableVerticalLayout() {
      return store.disableVerticalLayout;
    },
    setDisableVerticalLayout: (value: boolean) =>
      setStore("disableVerticalLayout", value),
    get disableAnimations() {
      return store.disableAnimations;
    },
    setDisableAnimations: (value: boolean) =>
      setStore("disableAnimations", value),
    get disableJapanese() {
      return store.disableJapanese;
    },
    setDisableJapanese(value: boolean) {
      setStore("disableJapanese", value);
    },
  };
};

/**
 * Provider component that makes the app context available to child components.
 * @param props - Component properties including children
 */
export const AppProvider: ParentComponent = (props) => {
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

/****************************************************
 * Themes
 ****************************************************/

/** Available theme options for the application */
export type Theme = keyof typeof themeIconMap;

/** 
 * Maps theme names to their corresponding icon identifiers.
 * Used for theme switching UI elements.
 */
export const themeIconMap = {
  light: "sun",
  gray: "cloud",
  dark: "moon",
  banana: "banana",
  strawberry: "strawberry",
  peanut: "peanut",
};

const themes = Object.keys(themeIconMap) as Theme[];

/**
 * Gets the next theme in the rotation sequence.
 * @param theme - Current theme
 * @returns Next theme in sequence, or first theme if at end
 */
export function getNextTheme(theme: Theme): Theme {
  const index = themes.indexOf(theme);
  if (index === -1 || index === themes.length - 1) {
    return themes[0];
  }
  return themes[index + 1];
}

/**
 * Determines the initial theme based on:
 * 1. localStorage preference
 * 2. HTML data-theme attribute
 * 3. System color scheme preference
 * 4. Falls back to 'gray' theme
 * @returns Initial theme to use
 */
function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored && themes.includes(stored as Theme)) {
    return stored as Theme;
  }

  const dsTheme = document.documentElement.dataset.theme;
  if (dsTheme && themes.includes(dsTheme as Theme)) {
    return dsTheme as Theme;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "gray";
}

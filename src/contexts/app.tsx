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
    setTheme: (theme: Theme) => {
      if (!import.meta.env.DEV) {
        if (theme === "christmas" && !isChristmasSeason()) {
          console.warn("Christmas theme is only available during the holiday season");
          return;
        }
        if (theme === "halloween" && !isHalloweenSeason()) {
          console.warn("Halloween theme is only available during the spooky season");
          return;
        }
      }
      setStore("theme", theme);
    },
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
  christmas: "christmas",
  halloween: "ghost",
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
 * Determines if it's Christmas season (Dec 1 to Jan 10)
 * Always returns true in development mode
 */
export function isChristmasSeason(): boolean {
  if (import.meta.env.DEV) return true;
  
  const today = new Date();
  const month = today.getMonth(); // 0-based (0 = January, 11 = December)
  const date = today.getDate();

  // Available Dec 1 to Jan 10
  return (month === 11 && date >= 1) || (month === 0 && date <= 10);
}

/**
 * Determines if it's Halloween season (1 week before, during, and 4 days after)
 * Always returns true in development mode
 */
export function isHalloweenSeason(): boolean {
  if (import.meta.env.DEV) return true;
  
  const today = new Date();
  const month = today.getMonth(); // 0-based (0 = January, 11 = December)
  const date = today.getDate();

  // Halloween is October 31st
  if (month === 9) { // October
    // Available from October 24th to November 4th
    return date >= 24;
  } else if (month === 10) { // November
    return date <= 4;
  }
  
  return false;
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  
  // Check for seasonal themes
  if (isHalloweenSeason() && stored === "halloween") {
    return "halloween";
  }
  if (isChristmasSeason() && stored === "christmas") {
    return "christmas";
  }
  
  // Otherwise fall back to normal theme selection logic
  if (stored && Object.keys(themeIconMap).includes(stored)) {
    // Don't allow seasonal themes outside of their seasons
    if ((stored === "halloween" && !isHalloweenSeason()) ||
        (stored === "christmas" && !isChristmasSeason())) {
      return "light";
    }
    return stored as Theme;
  }

  const dsTheme = document.documentElement.dataset.theme;
  if (dsTheme && Object.keys(themeIconMap).includes(dsTheme)) {
    return dsTheme as Theme;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "gray";
}

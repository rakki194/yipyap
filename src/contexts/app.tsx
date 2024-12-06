// src/contexts/app.tsx
/** Contains global app state that is not related to the gallery, such as theme preferences */

import {
  useContext,
  type ParentComponent,
  createRenderEffect,
  createEffect,
} from "solid-js";
import { Location, useLocation } from "@solidjs/router";
import { createStaticStore } from "@solid-primitives/static-store";
import { AppContext } from "~/contexts/contexts";

export interface AppContext {
  readonly prevRoute: Location | undefined;
  readonly location: Location;
  // Theme
  readonly theme: Theme;
  setTheme: (theme: Theme) => void;
  // Settings
  readonly instantDelete: boolean;
  setInstantDelete: (value: boolean) => void;
  readonly disableVerticalLayout: boolean;
  setDisableVerticalLayout: (value: boolean) => void;
  readonly disableAnimations: boolean;
  setDisableAnimations: (value: boolean) => void;
}

const createAppContext = (): AppContext => {
  const [store, setStore] = createStaticStore<{
    prevRoute?: Location;
    theme: Theme;
    instantDelete: boolean;
    disableVerticalLayout: boolean;
    disableAnimations: boolean;
  }>({
    theme: getInitialTheme(),
    instantDelete: localStorage.getItem("instantDelete") === "true",
    disableVerticalLayout:
      localStorage.getItem("disableVerticalLayout") === "true",
    disableAnimations: localStorage.getItem("disableAnimations") === "true",
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
  };
};

export const AppProvider: ParentComponent = (props) => {
  const value = createAppContext();
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext)!;
};

/****************************************************
 * Themes
 ****************************************************/

export type Theme = keyof typeof themeIconMap;

export const themeIconMap = {
  light: "sun",
  gray: "cloud",
  dark: "moon",
  banana: "banana",
  strawberry: "strawberry",
  peanut: "peanut",
};

const themes = Object.keys(themeIconMap) as Theme[];

export function getNextTheme(theme: Theme): Theme {
  const index = themes.indexOf(theme);
  if (index === -1 || index === themes.length - 1) {
    return themes[0];
  }
  return themes[index + 1];
}

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

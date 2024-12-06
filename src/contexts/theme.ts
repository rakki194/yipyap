import { createSignal, createRenderEffect } from "solid-js";
import { createSingletonRoot } from "@solid-primitives/rootless";

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

export const useTheme = createSingletonRoot(() => {
  const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

  // Update theme in localStorage and HTML dataset
  createRenderEffect(() => {
    const currentTheme = theme();
    localStorage.setItem("theme", currentTheme);
    document.documentElement.dataset.theme = currentTheme;
  });

  const toggleTheme = () => {
    setTheme(getNextTheme);
  };

  return {
    get theme() {
      return theme();
    },
    setTheme,
    toggleTheme,
  };
});

function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem("theme");
  if (stored && themes.includes(stored as Theme)) {
    return stored as Theme;
  }

  // Then check HTML dataset
  const dsTheme = document.documentElement.dataset.theme;
  if (dsTheme && themes.includes(dsTheme as Theme)) {
    return dsTheme as Theme;
  }

  // Finally, check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  // Default to gray
  return "gray";
}

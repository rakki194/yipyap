import { createSignal, createRenderEffect } from "solid-js";
import { createSingletonRoot } from "@solid-primitives/rootless";

export type Theme = "light" | "gray" | "dark" | "banana" | "strawberry";
const themes: Theme[] = ["light", "gray", "dark", "banana", "strawberry"];

export function getNextTheme(theme: Theme): Theme {
  switch (theme) {
    case "light":
      return "gray";
    case "gray":
      return "dark";
    case "dark":
      return "banana";
    case "banana":
      return "strawberry";
    case "strawberry":
      return "light";
  }
}

export const useTheme = createSingletonRoot(() => {
  const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

  createRenderEffect(() => {
    const currentTheme = theme();
    // Update localStorage
    localStorage.setItem("theme", currentTheme);
    // Update HTML dataset
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

  return "gray";
}

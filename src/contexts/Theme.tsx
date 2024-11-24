import { createSignal, createRenderEffect } from "solid-js";
import { createSingletonRoot } from "@solid-primitives/rootless";

type Theme = "light" | "dark";

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
    setTheme((current) => (current === "light" ? "dark" : "light"));
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
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Then check HTML dataset
  if (document.documentElement.dataset.theme === "dark") {
    return "dark";
  }

  // Finally, check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

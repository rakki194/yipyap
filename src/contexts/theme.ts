// src/contexts/theme.ts
/**
 * Contains theme-related logic. Integrated in AppProvider.
 */

function makeThemeList() {
  const today = new Date();
  const month = today.getMonth(); // 0-based (0 = January, 11 = December)
  const date = today.getDate();

  // Determines if it's Christmas season (Dec 1 to Jan 10)
  const isChristmas =
    (month === 11 && date >= 1) || (month === 0 && date <= 10);
  // Determines if it's Halloween season (1 week before, during, and 4 days after)
  const isHalloween =
    (month === 9 && date >= 24) || (month === 10 && date <= 4);

  const themeIconMap: Partial<Record<Theme, string>> = {
    light: "sun",
    gray: "cloud",
    dark: "moon",
    banana: "banana",
    strawberry: "strawberry",
    peanut: "peanut",
  };

  if (import.meta.env.DEV || isChristmas) {
    themeIconMap.christmas = "christmas";
  }
  if (import.meta.env.DEV || isHalloween) {
    themeIconMap.halloween = "ghost";
  }
  return themeIconMap;
}

/** Available theme options for the application */
export type Theme =
  | "light"
  | "gray"
  | "dark"
  | "banana"
  | "strawberry"
  | "peanut"
  | "christmas"
  | "halloween";

/**
 * Maps theme names to their corresponding icon identifiers.
 * Used for theme switching UI elements.
 */
export const themeIconMap: Readonly<Partial<Record<Theme, string>>> =
  makeThemeList();
export const themes = Object.keys(themeIconMap) as Readonly<Theme[]>;

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

export function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");

  // Check that the theme is still valid
  if (stored && Object.keys(themeIconMap).includes(stored)) {
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

// src/contexts/theme.ts
/**
 * Contains theme-related logic. Integrated in AppProvider.
 */

/** Available theme options for the application */
export type Theme =
  | "light"
  | "gray"
  | "dark"
  | "banana"
  | "strawberry"
  | "peanut"
  | "high-contrast-black"
  | "high-contrast-inverse";

/** Base themes that are always available */
const baseThemes: Record<string, string> = {
  light: "sun",
  gray: "cloud",
  dark: "moon",
  banana: "banana",
  strawberry: "strawberry",
  peanut: "peanut",
  "high-contrast-black": "contrast",
  "high-contrast-inverse": "contrast-inverse",
};

export function makeThemeList(): Partial<Record<Theme, string>> {
  const themeIconMap = { ...baseThemes };

  return themeIconMap;
}

/**
 * Maps theme names to their corresponding icon identifiers.
 * Used for theme switching UI elements.
 */
export const themeIconMap: Record<string, string> = {
  dark: "moon",
  light: "sun",
  gray: "cloud",
  banana: "banana",
  strawberry: "strawberry",
  peanut: "peanut"
};

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
  const stored = localStorage.getItem("theme") as Theme | null;
  if (!stored || !Object.keys(themeIconMap).includes(stored)) {
    return "light";
  }
  return stored;
}

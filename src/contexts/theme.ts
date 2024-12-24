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
  | "christmas"
  | "halloween"
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

function isSeasonalThemeAvailable(theme: Theme): boolean {
  // Non-seasonal themes are always available
  if (theme !== 'christmas' && theme !== 'halloween') {
    return true;
  }

  // Always show seasonal themes in development mode
  if (import.meta.env.DEV) {
    return true;
  }

  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  switch (theme) {
    case 'christmas':
      return (month === 11) || (month === 0 && date <= 10);
    case 'halloween':
      return (month === 9 && date >= 24) || (month === 10 && date <= 4);
    default:
      return true;
  }
}

export function makeThemeList(): Partial<Record<Theme, string>> {
  const themeIconMap = { ...baseThemes };

  // Only add seasonal themes if they're available
  if (isSeasonalThemeAvailable('christmas' as Theme)) {
    themeIconMap.christmas = "christmas";
  }
  if (isSeasonalThemeAvailable('halloween' as Theme)) {
    themeIconMap.halloween = "ghost";
  }

  return themeIconMap;
}

/**
 * Maps theme names to their corresponding icon identifiers.
 * Used for theme switching UI elements.
 */
export const themeIconMap: Readonly<Partial<Record<Theme, string>>> = makeThemeList();
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

  // Helper function to check if a theme is currently available
  const isThemeAvailable = (theme: string): boolean => {
    if (!theme) return false;
    
    // Check if it's a base theme
    if (theme in baseThemes) return true;
    
    // Check if it's a seasonal theme and available
    if (theme === 'christmas' || theme === 'halloween') {
      return isSeasonalThemeAvailable(theme as Theme);
    }
    
    return false;
  };

  // Check that the theme is still valid and available for the current date
  if (stored && isThemeAvailable(stored)) {
    return stored;
  }

  const dsTheme = document.documentElement.dataset.theme;
  if (dsTheme && isThemeAvailable(dsTheme)) {
    return dsTheme as Theme;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "gray";
}

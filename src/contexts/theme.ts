// src/contexts/theme.ts
/**
 * Contains theme-related logic. Integrated in AppProvider.
 */

function isSeasonalThemeAvailable(theme: Theme): boolean {
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

export function makeThemeList() {
  const themeIconMap: Partial<Record<Theme, string>> = {
    light: "sun",
    gray: "cloud",
    dark: "moon",
    banana: "banana",
    strawberry: "strawberry",
    peanut: "peanut",
  };

  // Only add seasonal themes if in dev mode or during their appropriate season
  if (import.meta.env.DEV || isSeasonalThemeAvailable('christmas')) {
    themeIconMap.christmas = "christmas";
  }
  if (import.meta.env.DEV || isSeasonalThemeAvailable('halloween')) {
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
  const stored = localStorage.getItem("theme") as Theme | null;

  // Helper function to check if a theme is currently available
  const isThemeAvailable = (theme: string): boolean => {
    const availableThemes = Object.keys(makeThemeList());
    return availableThemes.includes(theme) && 
           (import.meta.env.DEV || isSeasonalThemeAvailable(theme as Theme));
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

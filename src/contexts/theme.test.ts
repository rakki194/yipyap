import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Theme, themeIconMap, themes, getNextTheme, getInitialTheme } from "./theme";
import * as themeModule from "./theme";

// Mock import.meta.env
vi.mock('import.meta', () => {
  return {
    env: {
      DEV: false
    }
  };
});

describe("Theme System", () => {
  const originalMatchMedia = window.matchMedia;
  const originalLocalStorage = window.localStorage;

  // Mock matchMedia
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
    });
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Theme List Generation", () => {
    it("should always include base themes", () => {
      const baseThemes = ["light", "gray", "dark", "banana", "strawberry", "peanut"];
      baseThemes.forEach(theme => {
        expect(themeIconMap[theme as Theme]).toBeDefined();
      });
    });

    it("should include Christmas theme during Christmas season", () => {
      // Mock December 25th
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 11, 25));
      
      // Create a new theme list with the mocked date
      const christmasThemes = themeModule.makeThemeList();
      expect(christmasThemes.christmas).toBe("christmas");
    });

    it("should include Halloween theme during Halloween season", () => {
      // Mock October 31st
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 9, 31));
      
      // Create a new theme list with the mocked date
      const halloweenThemes = themeModule.makeThemeList();
      expect(halloweenThemes.halloween).toBe("ghost");
    });

    it("should not include seasonal themes outside their season", () => {
      // Mock July 1st (no special themes)
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 6, 1));
      
      // Create a new theme list with the mocked date
      const regularThemes = themeModule.makeThemeList();
      expect(regularThemes.christmas).toBeUndefined();
      expect(regularThemes.halloween).toBeUndefined();
    });

    it("should include seasonal themes in dev mode regardless of date", () => {
      // Mock July 1st (normally no special themes)
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 6, 1));
      
      // Mock DEV mode
      const env = vi.mocked(import.meta.env);
      env.DEV = true;
      
      const devThemes = themeModule.makeThemeList();
      expect(devThemes.christmas).toBe("christmas");
      expect(devThemes.halloween).toBe("ghost");
      
      // Reset DEV mode
      env.DEV = false;
    });
  });

  describe("Theme Rotation", () => {
    it("should return next theme in sequence", () => {
      const currentTheme: Theme = "light";
      const nextTheme = getNextTheme(currentTheme);
      const currentIndex = themes.indexOf(currentTheme);
      expect(nextTheme).toBe(themes[currentIndex + 1]);
    });

    it("should wrap to first theme when at end", () => {
      const lastTheme = themes[themes.length - 1];
      expect(getNextTheme(lastTheme)).toBe(themes[0]);
    });

    it("should handle invalid theme by returning first theme", () => {
      const invalidTheme = "invalid" as Theme;
      expect(getNextTheme(invalidTheme)).toBe(themes[0]);
    });
  });

  describe("Initial Theme Detection", () => {
    it("should use theme from localStorage if valid", () => {
      vi.spyOn(localStorage, "getItem").mockReturnValue("dark");
      expect(getInitialTheme()).toBe("dark");
    });

    it("should use dataset theme if localStorage theme is invalid", () => {
      vi.spyOn(localStorage, "getItem").mockReturnValue("invalid");
      document.documentElement.dataset.theme = "light";
      expect(getInitialTheme()).toBe("light");
      delete document.documentElement.dataset.theme;
    });

    it("should respect system dark mode preference", () => {
      vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      expect(getInitialTheme()).toBe("dark");
    });

    it("should respect system light mode preference", () => {
      vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === "(prefers-color-scheme: light)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      expect(getInitialTheme()).toBe("light");
    });

    it("should default to gray when no preference is detected", () => {
      vi.spyOn(localStorage, "getItem").mockReturnValue(null);
      expect(getInitialTheme()).toBe("gray");
    });

    it("should fallback to default theme when seasonal theme is selected outside its season", () => {
      // Mock July 1st (outside both Halloween and Christmas seasons)
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 6, 1));
      
      // Mock localStorage with halloween theme
      vi.spyOn(localStorage, 'getItem').mockReturnValue('halloween');
      
      // Should fallback to system preference or gray
      expect(getInitialTheme()).toBe('gray');
      
      // Mock localStorage with christmas theme
      vi.spyOn(localStorage, 'getItem').mockReturnValue('christmas');
      
      // Should fallback to system preference or gray
      expect(getInitialTheme()).toBe('gray');
    });

    it("should keep seasonal theme when date changes to within season", () => {
      // Start with Christmas theme in summer
      vi.spyOn(localStorage, 'getItem').mockReturnValue('christmas');
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2023, 6, 1)); // July 1st
      
      // Should fallback when outside season
      expect(getInitialTheme()).toBe('gray');
      
      // Change date to Christmas season
      vi.setSystemTime(new Date(2023, 11, 25)); // December 25th
      
      // Should keep Christmas theme during season
      expect(getInitialTheme()).toBe('christmas');
    });
  });

  describe("Theme Icons", () => {
    it("should have correct icon mappings for base themes", () => {
      const expectedIcons = {
        light: "sun",
        gray: "cloud",
        dark: "moon",
        banana: "banana",
        strawberry: "strawberry",
        peanut: "peanut"
      };

      Object.entries(expectedIcons).forEach(([theme, icon]) => {
        expect(themeIconMap[theme as Theme]).toBe(icon);
      });
    });
  });
}); 
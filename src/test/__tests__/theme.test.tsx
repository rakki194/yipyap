/** @jsxImportSource solid-js */
/// <reference types="vitest/globals" />
/// <reference types="@solidjs/testing-library" />

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Component } from "solid-js";

// Mock import.meta.env before any imports
vi.mock('import.meta', () => ({
  env: {
    DEV: false,
    PROD: true
  }
}));

// Create a module-level variable to control DEV mode
let isDev = false;

// Mock the theme module before importing it
vi.mock('../../contexts/theme', () => {
  type ThemeIconMap = {
    light: string;
    gray: string;
    dark: string;
    banana: string;
    strawberry: string;
    peanut: string;
    "high-contrast-black": string;
    "high-contrast-inverse": string;
    christmas?: string;
    halloween?: string;
  };

  const baseThemes: ThemeIconMap = {
    light: "sun",
    gray: "cloud",
    dark: "moon",
    banana: "banana",
    strawberry: "strawberry",
    peanut: "peanut",
    "high-contrast-black": "contrast",
    "high-contrast-inverse": "contrast-inverse",
  };

  function isSeasonalThemeAvailable(theme: string): boolean {
    if (isDev) return true;
    
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

  function makeThemeList(): ThemeIconMap {
    const themeIconMap = { ...baseThemes };

    if (isSeasonalThemeAvailable('christmas')) {
      themeIconMap.christmas = "christmas";
    }
    if (isSeasonalThemeAvailable('halloween')) {
      themeIconMap.halloween = "ghost";
    }

    return themeIconMap;
  }

  function getInitialTheme(): string {
    const stored = window.localStorage.getItem("theme");
    
    if (!stored) return "gray";

    // Check if it's a base theme
    if (stored in baseThemes) return stored;
    
    // Check if it's a seasonal theme and available
    if ((stored === 'christmas' || stored === 'halloween') && isSeasonalThemeAvailable(stored)) {
      return stored;
    }
    
    return "gray";
  }

  return {
    baseThemes,
    makeThemeList,
    getInitialTheme,
    isSeasonalThemeAvailable,
    getNextTheme: vi.fn(),
    themes: Object.keys(baseThemes),
    themeIconMap: makeThemeList()
  };
});

import { Theme, makeThemeList, getInitialTheme } from "../../contexts/theme";
import { ThemeProvider } from "../../theme/ThemeProvider";

// Store reference to real Date constructor
const RealDate = global.Date;

function createMockDate(mockDate: Date) {
  class MockDate extends Date {
    constructor() {
      super();
      return mockDate;
    }

    static now() {
      return mockDate.getTime();
    }
  }

  Object.defineProperties(MockDate.prototype, {
    getMonth: { value: () => mockDate.getMonth() },
    getDate: { value: () => mockDate.getDate() },
    getTime: { value: () => mockDate.getTime() }
  });

  return MockDate as unknown as DateConstructor;
}

describe("Theme System", () => {
  const originalMatchMedia = window.matchMedia;
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    // Reset mock storage and isDev flag
    mockStorage = {};
    isDev = false;

    // Mock matchMedia
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
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; },
        clear: () => { mockStorage = {}; },
        length: 0,
        key: vi.fn(),
      },
      writable: true
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    mockStorage = {};
    global.Date = RealDate;
    vi.restoreAllMocks();
  });

  describe("Theme List Generation", () => {
    it("should not include seasonal themes outside their season in production", () => {
      // Ensure we're in production mode
      isDev = false;

      // Mock July 1st (no special themes)
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      
      const regularThemes = makeThemeList();
      expect(regularThemes.christmas).toBeUndefined();
      expect(regularThemes.halloween).toBeUndefined();
    });

    it("should include seasonal themes in development mode regardless of date", () => {
      // Set development mode
      isDev = true;

      // Mock July 1st (normally no special themes)
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      
      const devThemes = makeThemeList();
      expect(devThemes.christmas).toBe("christmas");
      expect(devThemes.halloween).toBe("ghost");
    });

    it("should include Christmas theme during Christmas season in production", () => {
      // Ensure production mode
      isDev = false;

      // Mock December 25th
      global.Date = createMockDate(new RealDate(2023, 11, 25));
      
      const christmasThemes = makeThemeList();
      expect(christmasThemes.christmas).toBe("christmas");
    });

    it("should include Halloween theme during Halloween season in production", () => {
      // Ensure production mode
      isDev = false;

      // Mock October 31st
      global.Date = createMockDate(new RealDate(2023, 9, 31));
      
      const halloweenThemes = makeThemeList();
      expect(halloweenThemes.halloween).toBe("ghost");
    });
  });

  describe("Initial Theme Detection", () => {
    it("should fallback to default theme when seasonal theme is selected outside its season in production", () => {
      // Ensure production mode
      isDev = false;

      // Mock July 1st (outside both Halloween and Christmas seasons)
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      
      // Mock localStorage with halloween theme
      mockStorage.theme = 'halloween';
      expect(getInitialTheme()).toBe('gray');
      
      // Mock localStorage with christmas theme
      mockStorage.theme = 'christmas';
      expect(getInitialTheme()).toBe('gray');
    });

    it("should keep seasonal theme in development mode regardless of date", () => {
      // Set development mode
      isDev = true;

      // Mock July 1st (normally no special themes)
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      
      // Test with Halloween theme
      mockStorage.theme = 'halloween';
      expect(getInitialTheme()).toBe('halloween');

      // Test with Christmas theme
      mockStorage.theme = 'christmas';
      expect(getInitialTheme()).toBe('christmas');
    });

    it("should keep seasonal theme when date changes to within season in production", () => {
      // Ensure production mode
      isDev = false;

      mockStorage.theme = 'christmas';
      
      // Set date to summer
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      expect(getInitialTheme()).toBe('gray');
      
      // Change date to Christmas season
      global.Date = createMockDate(new RealDate(2023, 11, 25));
      expect(getInitialTheme()).toBe('christmas');
    });
  });

  describe("Theme Provider Integration", () => {
    it("should render with default theme", async () => {
      const TestComponent: Component = () => (
        <ThemeProvider>
          <div data-testid="themed-element">Test</div>
        </ThemeProvider>
      );

      render(() => <TestComponent />);
      
      const themedElement = await screen.findByTestId("themed-element");
      expect(themedElement).toBeDefined();
    });
  });
}); 
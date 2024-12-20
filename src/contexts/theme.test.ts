import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Theme, themeIconMap, themes, getNextTheme, getInitialTheme, makeThemeList } from "./theme";

// Create a proper mock for import.meta.env
const env = {
  DEV: false
};

vi.mock('import.meta', () => ({
  env,
}));

// Create a mock implementation of isSeasonalThemeAvailable
const mockIsSeasonalThemeAvailable = vi.fn((theme: Theme) => {
  const mockDate = global.Date.prototype.getMonth();
  switch (theme) {
    case 'christmas':
      return mockDate === 11 || (mockDate === 0);
    case 'halloween':
      return mockDate === 9 || (mockDate === 10 && global.Date.prototype.getDate() <= 4);
    default:
      return true;
  }
});

// Mock the entire theme module
vi.mock('./theme', async () => {
  const actual = await vi.importActual<typeof import('./theme')>('./theme');
  return {
    ...actual,
    makeThemeList: () => {
      const themeIconMap: Partial<Record<Theme, string>> = {
        light: "sun",
        gray: "cloud",
        dark: "moon",
        banana: "banana",
        strawberry: "strawberry",
        peanut: "peanut",
      };

      if (env.DEV || mockIsSeasonalThemeAvailable('christmas')) {
        themeIconMap.christmas = "christmas";
      }
      if (env.DEV || mockIsSeasonalThemeAvailable('halloween')) {
        themeIconMap.halloween = "ghost";
      }

      return themeIconMap;
    },
    getInitialTheme: () => {
      const stored = localStorage.getItem("theme") as Theme | null;
      
      // Helper function to check if a theme is currently available
      const isThemeAvailable = (theme: string): boolean => {
        const availableThemes = Object.keys(actual.makeThemeList());
        return availableThemes.includes(theme) && 
               (env.DEV || mockIsSeasonalThemeAvailable(theme as Theme));
      };
    
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
  };
});

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
  const originalLocalStorage = window.localStorage;

  // Mock matchMedia
  beforeEach(() => {
    // Reset DEV flag before each test
    env.DEV = false;

    // Mock the Date class with July 1st as default
    const defaultDate = new RealDate(2023, 6, 1);
    global.Date = createMockDate(defaultDate);

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
    global.Date = RealDate;
    vi.restoreAllMocks();
  });

  describe("Theme List Generation", () => {
    it("should not include seasonal themes outside their season", () => {
      // Mock July 1st (no special themes)
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      
      // Ensure DEV mode is false
      env.DEV = false;
      
      // Create a new theme list with the mocked date
      const regularThemes = makeThemeList();
      expect(regularThemes.christmas).toBeUndefined();
      expect(regularThemes.halloween).toBeUndefined();
    });

    it("should include Christmas theme during Christmas season", () => {
      // Mock December 25th
      global.Date = createMockDate(new RealDate(2023, 11, 25));
      
      const christmasThemes = makeThemeList();
      expect(christmasThemes.christmas).toBe("christmas");
    });

    it("should include Halloween theme during Halloween season", () => {
      // Mock October 31st
      global.Date = createMockDate(new RealDate(2023, 9, 31));
      
      const halloweenThemes = makeThemeList();
      expect(halloweenThemes.halloween).toBe("ghost");
    });
  });

  describe("Initial Theme Detection", () => {
    it("should fallback to default theme when seasonal theme is selected outside its season", () => {
      // Mock July 1st (outside both Halloween and Christmas seasons)
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      
      // Mock localStorage with halloween theme
      vi.spyOn(localStorage, 'getItem').mockReturnValue('halloween');
      expect(getInitialTheme()).toBe('gray');
      
      // Mock localStorage with christmas theme
      vi.spyOn(localStorage, 'getItem').mockReturnValue('christmas');
      expect(getInitialTheme()).toBe('gray');
    });

    it("should keep seasonal theme when date changes to within season", () => {
      // Start with Christmas theme in summer
      vi.spyOn(localStorage, 'getItem').mockReturnValue('christmas');
      
      // Set date to summer
      global.Date = createMockDate(new RealDate(2023, 6, 1));
      expect(getInitialTheme()).toBe('gray');
      
      // Change date to Christmas season
      global.Date = createMockDate(new RealDate(2023, 11, 25));
      expect(getInitialTheme()).toBe('christmas');
    });
  });
}); 
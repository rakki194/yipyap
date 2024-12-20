import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Theme, themeIconMap, themes, getNextTheme, getInitialTheme } from "./theme";
import * as themeModule from "./theme";

// Create a proper mock for import.meta.env
const env = {
  DEV: false
};

vi.mock('import.meta', () => ({
  env,
}));

// Mock isSeasonalThemeAvailable
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

vi.mock('./theme', async (importOriginal) => {
  const mod = await importOriginal() as typeof import('./theme');
  return {
    ...mod,
    isSeasonalThemeAvailable: mockIsSeasonalThemeAvailable,
  };
});

// Store reference to real Date constructor
const RealDate = global.Date;

function createMockDate(mockDate: Date) {
  function MockDate(this: any) {
    return mockDate;
  }

  Object.setPrototypeOf(MockDate, Date);
  Object.defineProperty(MockDate, 'prototype', {
    value: Object.create(Date.prototype, {
      getMonth: {
        value: function() { return mockDate.getMonth(); }
      },
      getDate: {
        value: function() { return mockDate.getDate(); }
      },
      getTime: {
        value: function() { return mockDate.getTime(); }
      }
    })
  });

  MockDate.now = () => mockDate.getTime();

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
      const regularThemes = themeModule.makeThemeList();
      expect(regularThemes.christmas).toBeUndefined();
      expect(regularThemes.halloween).toBeUndefined();
    });

    it("should include Christmas theme during Christmas season", () => {
      // Mock December 25th
      global.Date = createMockDate(new RealDate(2023, 11, 25));
      
      const christmasThemes = themeModule.makeThemeList();
      expect(christmasThemes.christmas).toBe("christmas");
    });

    it("should include Halloween theme during Halloween season", () => {
      // Mock October 31st
      global.Date = createMockDate(new RealDate(2023, 9, 31));
      
      const halloweenThemes = themeModule.makeThemeList();
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
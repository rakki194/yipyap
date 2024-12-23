/**
 * Theme System Test Suite
 * 
 * This test suite verifies the functionality of the application's theme system,
 * including seasonal themes (Christmas and Halloween) and default themes.
 * 
 * Key areas tested:
 * - Theme list generation based on seasonal availability
 * - Initial theme detection and fallback behavior
 * - Seasonal theme availability periods
 * - Theme persistence and restoration
 * 
 * Test Environment Setup:
 * - Mocks the Date object to test seasonal theme behavior
 * - Mocks localStorage for theme persistence testing
 * - Mocks matchMedia for system theme preference detection
 * - Mocks import.meta.env for development mode testing
 * 
 * Seasonal Theme Rules:
 * - Christmas theme: Available December 1st through January 10th
 * - Halloween theme: Available October 24th through November 4th
 * - All seasonal themes are always available in development mode
 * 
 * Default Theme Behavior:
 * - Falls back to system preference (dark/light) if available
 * - Uses 'gray' theme as final fallback
 * - Preserves user theme selection if theme is currently available
 * 
 * @packageDocumentation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Theme, themeIconMap, themes, getNextTheme, getInitialTheme, makeThemeList } from "../../contexts/theme";

// Create a proper mock for import.meta.env
const env = {
  DEV: false
};

vi.mock('import.meta', () => ({
  env,
}));

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

    // Mock matchMedia to return no preference by default
    window.matchMedia = vi.fn().mockImplementation((query) => ({
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
    const mockStorage: Record<string, string> = {};
    window.localStorage = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => { mockStorage[key] = value.toString(); }),
      removeItem: vi.fn((key) => delete mockStorage[key]),
      clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }),
      key: vi.fn((index) => Object.keys(mockStorage)[index] || null),
      length: Object.keys(mockStorage).length,
    };
  });

  afterEach(() => {
    // Restore original implementations
    window.matchMedia = originalMatchMedia;
    window.localStorage = originalLocalStorage;
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
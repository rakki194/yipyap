import { describe, it, expect } from "vitest";
import { getPolishPlural } from "../../i18n/utils";

/**
 * Tests for Polish plural system
 * 
 * Polish has a complex plural system with three forms:
 * 1. Singular (1): plik
 * 2. Plural for 2-4 (except 12-14): pliki
 * 3. Plural for 0, 5-21, and numbers ending in 5-9: plików
 * 
 * Test cases cover:
 * - Basic number forms
 * - Teen numbers (12-14)
 * - Numbers ending in 2-4
 * - Numbers ending in 5-9
 * - Zero case
 * - Negative numbers
 * - Decimal numbers
 */

describe("Polish plural system", () => {
  describe("getPolishPlural", () => {
    const forms = {
      singular: "plik",
      plural2_4: "pliki",
      plural5_: "plików"
    };

    it("should handle singular (1) correctly", () => {
      expect(getPolishPlural(1, forms)).toBe("plik");
      expect(getPolishPlural(21, forms)).toBe("plik");
      expect(getPolishPlural(31, forms)).toBe("plik");
    });

    it("should handle 2-4 correctly", () => {
      [2, 3, 4, 22, 23, 24].forEach(num => {
        expect(getPolishPlural(num, forms)).toBe("pliki");
      });
    });

    it("should handle teens (12-14) correctly", () => {
      [12, 13, 14].forEach(num => {
        expect(getPolishPlural(num, forms)).toBe("plików");
      });
    });

    it("should handle numbers ending in 5-9 correctly", () => {
      [5, 6, 7, 8, 9, 25, 26, 27, 28, 29].forEach(num => {
        expect(getPolishPlural(num, forms)).toBe("plików");
      });
    });

    it("should handle zero correctly", () => {
      expect(getPolishPlural(0, forms)).toBe("plików");
    });

    it("should handle negative numbers the same as positive", () => {
      expect(getPolishPlural(-1, forms)).toBe("plik");
      expect(getPolishPlural(-2, forms)).toBe("pliki");
      expect(getPolishPlural(-5, forms)).toBe("plików");
    });

    it("should handle decimal numbers by truncating", () => {
      expect(getPolishPlural(1.5, forms)).toBe("plik");
      expect(getPolishPlural(2.7, forms)).toBe("pliki");
      expect(getPolishPlural(5.3, forms)).toBe("plików");
    });
  });
}); 
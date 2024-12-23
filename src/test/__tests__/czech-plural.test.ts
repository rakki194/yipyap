import { describe, it, expect } from "vitest";
import { getCzechPlural } from "../../i18n/utils";

/**
 * Tests for Czech plural system
 * 
 * Czech has a complex plural system with three forms:
 * 1. Singular (1): soubor
 * 2. Plural for 2-4 (except 12-14): soubory
 * 3. Plural for 0, 5+, and teens: souborů
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

describe("Czech plural system", () => {
  describe("getCzechPlural", () => {
    const forms = {
      singular: "soubor",
      plural2_4: "soubory",
      plural5_: "souborů"
    };

    it("should handle singular (1) correctly", () => {
      expect(getCzechPlural(1, forms)).toBe("soubor");
      expect(getCzechPlural(21, forms)).toBe("soubor");
      expect(getCzechPlural(31, forms)).toBe("soubor");
      expect(getCzechPlural(101, forms)).toBe("soubor");
    });

    it("should handle 2-4 correctly", () => {
      [2, 3, 4, 22, 23, 24, 102, 103, 104].forEach(num => {
        expect(getCzechPlural(num, forms)).toBe("soubory");
      });
    });

    it("should handle teens (12-14) correctly", () => {
      [12, 13, 14, 112, 113, 114].forEach(num => {
        expect(getCzechPlural(num, forms)).toBe("souborů");
      });
    });

    it("should handle numbers ending in 5-9 correctly", () => {
      [5, 6, 7, 8, 9, 25, 26, 27, 28, 29].forEach(num => {
        expect(getCzechPlural(num, forms)).toBe("souborů");
      });
    });

    it("should handle zero correctly", () => {
      expect(getCzechPlural(0, forms)).toBe("souborů");
    });

    it("should handle negative numbers the same as positive", () => {
      expect(getCzechPlural(-1, forms)).toBe("soubor");
      expect(getCzechPlural(-2, forms)).toBe("soubory");
      expect(getCzechPlural(-5, forms)).toBe("souborů");
    });

    it("should handle decimal numbers by truncating", () => {
      expect(getCzechPlural(1.5, forms)).toBe("soubor");
      expect(getCzechPlural(2.7, forms)).toBe("soubory");
      expect(getCzechPlural(5.3, forms)).toBe("souborů");
    });
  });
}); 
import { describe, it, expect } from "vitest";
import { getArabicPlural } from "../utils";

/**
 * Tests for Arabic plural system
 * 
 * Arabic has a complex plural system with different forms:
 * - Singular (1): كتاب (kitab) - book
 * - Dual (2): كتابان (kitaban) - two books
 * - Plural (3-10): كتب (kutub) - books
 * - Plural (11+): كتابًا (kitaban) - books (different form)
 * 
 * Test cases cover:
 * - Basic number forms
 * - Zero case
 * - Negative numbers
 * - Decimal numbers
 * - Optional large plural form
 */

describe("Arabic plural system", () => {
  describe("getArabicPlural", () => {
    const forms = {
      singular: "كتاب",
      dual: "كتابان",
      plural: "كتب",
      pluralLarge: "كتابًا"
    };

    const formsWithoutLarge = {
      singular: "كتاب",
      dual: "كتابان",
      plural: "كتب"
    };

    it("should handle zero correctly", () => {
      expect(getArabicPlural(0, forms)).toBe(forms.plural);
    });

    it("should handle singular (1) correctly", () => {
      expect(getArabicPlural(1, forms)).toBe(forms.singular);
    });

    it("should handle dual (2) correctly", () => {
      expect(getArabicPlural(2, forms)).toBe(forms.dual);
    });

    it("should handle small plural (3-10) correctly", () => {
      [3, 4, 5, 6, 7, 8, 9, 10].forEach(num => {
        expect(getArabicPlural(num, forms)).toBe(forms.plural);
      });
    });

    it("should handle large plural (11+) correctly", () => {
      [11, 12, 100, 1000].forEach(num => {
        expect(getArabicPlural(num, forms)).toBe(forms.pluralLarge);
      });
    });

    it("should fall back to regular plural when pluralLarge is not provided", () => {
      [11, 12, 100, 1000].forEach(num => {
        expect(getArabicPlural(num, formsWithoutLarge)).toBe(formsWithoutLarge.plural);
      });
    });

    it("should handle negative numbers the same as positive", () => {
      expect(getArabicPlural(-1, forms)).toBe(forms.singular);
      expect(getArabicPlural(-2, forms)).toBe(forms.dual);
      expect(getArabicPlural(-5, forms)).toBe(forms.plural);
      expect(getArabicPlural(-11, forms)).toBe(forms.pluralLarge);
    });

    it("should handle decimal numbers by truncating", () => {
      expect(getArabicPlural(1.5, forms)).toBe(forms.singular);
      expect(getArabicPlural(2.7, forms)).toBe(forms.dual);
      expect(getArabicPlural(5.3, forms)).toBe(forms.plural);
      expect(getArabicPlural(11.9, forms)).toBe(forms.pluralLarge);
    });
  });
}); 
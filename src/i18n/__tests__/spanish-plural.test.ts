import { describe, it, expect } from "vitest";
import { getSpanishPlural } from "../utils";

/**
 * Tests for Spanish plural system
 * 
 * Spanish has several rules for forming plurals:
 * 1. Words ending in vowels: add -s (casa → casas)
 * 2. Words ending in consonants: add -es (papel → papeles)
 * 3. Words ending in -z: change z to c and add -es (lápiz → lápices)
 * 4. Words ending in stressed vowels: add -es (bambú → bambúes)
 * 5. Some words ending in -s remain unchanged (lunes → lunes)
 * 
 * The getSpanishPlural function handles quantity-based plural forms:
 * - 0: uses plural form
 * - 1: uses singular form
 * - 2+: uses plural form
 */

describe("Spanish plural system", () => {
  describe("getSpanishPlural", () => {
    const forms = {
      singular: "archivo",
      plural: "archivos"
    };

    const specialForms = {
      singular: "análisis",
      plural: "análisis" // Unchanged in plural
    };

    it("should handle zero correctly", () => {
      expect(getSpanishPlural(0, forms)).toBe(forms.plural);
    });

    it("should handle singular (1) correctly", () => {
      expect(getSpanishPlural(1, forms)).toBe(forms.singular);
    });

    it("should handle plural (2+) correctly", () => {
      [2, 3, 4, 5, 10, 20, 100].forEach(num => {
        expect(getSpanishPlural(num, forms)).toBe(forms.plural);
      });
    });

    it("should handle negative numbers the same as positive", () => {
      expect(getSpanishPlural(-1, forms)).toBe(forms.singular);
      expect(getSpanishPlural(-2, forms)).toBe(forms.plural);
    });

    it("should handle decimal numbers by truncating", () => {
      expect(getSpanishPlural(1.5, forms)).toBe(forms.singular);
      expect(getSpanishPlural(2.1, forms)).toBe(forms.plural);
    });

    it("should handle special unchanging plurals", () => {
      [0, 1, 2].forEach(num => {
        expect(getSpanishPlural(num, specialForms)).toBe(specialForms.singular);
      });
    });
  });
}); 
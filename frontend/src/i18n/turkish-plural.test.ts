import { describe, it, expect } from "vitest";
import { getTurkishPlural } from "./utils";

/**
 * Tests for Turkish plural system
 * 
 * Turkish uses vowel harmony for plural suffixes:
 * - Words with back vowels (a, ı, o, u) use -lar
 * - Words with front vowels (e, i, ö, ü) use -ler
 * 
 * Examples:
 * - kitap → kitaplar (back vowel 'a')
 * - ev → evler (front vowel 'e')
 * - köpek → köpekler (front vowel 'ö')
 * - kuş → kuşlar (back vowel 'u')
 */

describe("Turkish plural system", () => {
  describe("getTurkishPlural", () => {
    const forms = {
      singular: "dosya",
      pluralLar: "dosyalar",
      pluralLer: "dosyaler"
    };

    it("should handle words with back vowels correctly", () => {
      const backVowelWords = ["kitap", "masa", "kutu", "yol"];
      backVowelWords.forEach(word => {
        expect(getTurkishPlural(word, forms)).toBe(forms.pluralLar);
      });
    });

    it("should handle words with front vowels correctly", () => {
      const frontVowelWords = ["ev", "köpek", "gül", "şehir"];
      frontVowelWords.forEach(word => {
        expect(getTurkishPlural(word, forms)).toBe(forms.pluralLer);
      });
    });

    it("should be case insensitive", () => {
      expect(getTurkishPlural("KITAP", forms)).toBe(forms.pluralLar);
      expect(getTurkishPlural("Ev", forms)).toBe(forms.pluralLer);
    });

    it("should handle words with multiple vowels based on the last vowel", () => {
      expect(getTurkishPlural("telefon", forms)).toBe(forms.pluralLar);
      expect(getTurkishPlural("bilgisayar", forms)).toBe(forms.pluralLar);
      expect(getTurkishPlural("öğretmen", forms)).toBe(forms.pluralLer);
    });

    it("should default to -ler for words without vowels", () => {
      expect(getTurkishPlural("", forms)).toBe(forms.pluralLer);
      expect(getTurkishPlural("krk", forms)).toBe(forms.pluralLer);
    });
  });
}); 
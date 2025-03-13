/**
 * Tests for the pluralization system used in translations.
 * 
 * The pluralization system handles different plural forms across languages:
 * - English-like: singular (1) and plural (other)
 * - Arabic: zero, singular (1), dual (2), few (3-10), many (11+)
 * - Russian/Ukrainian: singular (1, 21, 31...), few (2-4, 22-24...), many (5-20, 25-30...)
 * - Polish: similar to Russian but with different rules for teens
 * - Languages without plurals (Japanese, Chinese): always use 'other' form
 * 
 * Test cases cover:
 * 1. Basic plural form selection for each language type
 * 2. Interpolation of count and other parameters
 * 3. Fallback behavior when required forms are missing
 * 4. Edge cases (zero, null parameters, etc.)
 * 
 * @see {@link PluralForms} for the structure of plural forms
 * @see {@link getPlural} for the core pluralization function
 * @see {@link createPluralTranslation} for the translation function factory
 */

import { describe, it, expect } from 'vitest';
import { createPluralTranslation, getPlural, type PluralForms } from './plurals';
import { pluralRules } from "./plurals";

describe('Pluralization System', () => {
  /**
   * Tests for the getPlural function which selects the appropriate plural form
   * based on a number and language.
   * 
   * Each language family has its own rules:
   * - English uses one/other
   * - Arabic uses zero/one/two/few/many
   * - Russian uses one/few/many with complex rules
   * - Polish has similar but distinct rules from Russian
   * - Some languages don't use pluralization at all
   */
  describe('getPlural', () => {
    const forms: PluralForms = {
      zero: "0 items",
      one: "1 item",
      two: "2 items",
      few: "few items",
      many: "many items",
      other: "${count} items"
    };

    it('handles English plurals', () => {
      expect(getPlural(1, forms, 'en')).toBe('1 item');
      expect(getPlural(2, forms, 'en')).toBe('${count} items');
      expect(getPlural(5, forms, 'en')).toBe('${count} items');
    });

    it('handles Arabic plurals', () => {
      expect(getPlural(0, forms, 'ar')).toBe('0 items');
      expect(getPlural(1, forms, 'ar')).toBe('1 item');
      expect(getPlural(2, forms, 'ar')).toBe('2 items');
      expect(getPlural(3, forms, 'ar')).toBe('few items');
      expect(getPlural(11, forms, 'ar')).toBe('many items');
    });

    it('handles Russian plurals', () => {
      expect(getPlural(1, forms, 'ru')).toBe('1 item');
      expect(getPlural(2, forms, 'ru')).toBe('few items');
      expect(getPlural(5, forms, 'ru')).toBe('many items');
      expect(getPlural(21, forms, 'ru')).toBe('1 item');
      expect(getPlural(22, forms, 'ru')).toBe('few items');
    });

    it('handles Polish plurals', () => {
      expect(getPlural(1, forms, 'pl')).toBe('1 item');
      expect(getPlural(2, forms, 'pl')).toBe('few items');
      expect(getPlural(5, forms, 'pl')).toBe('many items');
      expect(getPlural(22, forms, 'pl')).toBe('few items');
      expect(getPlural(25, forms, 'pl')).toBe('many items');
    });

    it('handles languages without plurals', () => {
      expect(getPlural(0, forms, 'ja')).toBe('${count} items');
      expect(getPlural(1, forms, 'ja')).toBe('${count} items');
      expect(getPlural(2, forms, 'ja')).toBe('${count} items');
      expect(getPlural(5, forms, 'zh')).toBe('${count} items');
    });
  });

  /**
   * Tests for the createPluralTranslation function which creates a translation
   * function that handles both pluralization and parameter interpolation.
   * 
   * Tests cover:
   * 1. Basic pluralization in different languages
   * 2. Parameter interpolation (count and other parameters)
   * 3. Handling of missing/invalid parameters
   * 4. Fallback behavior when required plural forms are missing
   */
  describe('createPluralTranslation', () => {
    it('creates English plural translations', () => {
      const translate = createPluralTranslation({
        one: '1 file',
        other: '${count} files'
      }, 'en');

      expect(translate({ count: 1 })).toBe('1 file');
      expect(translate({ count: 2 })).toBe('2 files');
      expect(translate({ count: 5 })).toBe('5 files');
    });

    it('handles missing count parameter', () => {
      const translate = createPluralTranslation({
        one: '1 file',
        other: '${count} files'
      }, 'en');

      expect(translate({})).toBe('some files');
      expect(translate(null)).toBe('some files');
      expect(translate(undefined)).toBe('some files');
    });

    it('handles Arabic plural translations', () => {
      const translate = createPluralTranslation({
        one: 'ملف واحد',
        two: 'ملفان',
        few: '${count} ملفات',
        many: '${count} ملفاً',
        other: '${count} ملف'
      }, 'ar');

      expect(translate({ count: 0 })).toBe('0 ملف');
      expect(translate({ count: 1 })).toBe('ملف واحد');
      expect(translate({ count: 2 })).toBe('ملفان');
      expect(translate({ count: 3 })).toBe('3 ملفات');
      expect(translate({ count: 11 })).toBe('11 ملفاً');
    });

    it('handles Russian plural translations', () => {
      const translate = createPluralTranslation({
        one: '${count} файл',
        few: '${count} файла',
        many: '${count} файлов',
        other: '${count} файлов'
      }, 'ru');

      expect(translate({ count: 1 })).toBe('1 файл');
      expect(translate({ count: 2 })).toBe('2 файла');
      expect(translate({ count: 5 })).toBe('5 файлов');
      expect(translate({ count: 21 })).toBe('21 файл');
      expect(translate({ count: 22 })).toBe('22 файла');
    });

    it('handles Polish plural translations', () => {
      const translate = createPluralTranslation({
        one: '${count} plik',
        few: '${count} pliki',
        many: '${count} plików',
        other: '${count} plików'
      }, 'pl');

      expect(translate({ count: 1 })).toBe('1 plik');
      expect(translate({ count: 2 })).toBe('2 pliki');
      expect(translate({ count: 5 })).toBe('5 plików');
      expect(translate({ count: 22 })).toBe('22 pliki');
      expect(translate({ count: 25 })).toBe('25 plików');
    });

    it('handles interpolation of other parameters', () => {
      const translate = createPluralTranslation({
        one: '1 ${type} selected',
        other: '${count} ${type}s selected'
      }, 'en');

      expect(translate({ count: 1, type: 'file' })).toBe('1 file selected');
      expect(translate({ count: 2, type: 'file' })).toBe('2 files selected');
      expect(translate({ count: 1, type: 'folder' })).toBe('1 folder selected');
      expect(translate({ count: 5, type: 'folder' })).toBe('5 folders selected');
    });

    it('handles missing required forms gracefully', () => {
      const translate = createPluralTranslation({
        one: '1 item',
        other: '${count} items'
      }, 'ru'); // Russian needs few/many forms

      expect(translate({ count: 1 })).toBe('1 item');
      expect(translate({ count: 2 })).toBe('2 items');
      expect(translate({ count: 5 })).toBe('5 items');
    });
  });

  describe("Romanian pluralization", () => {
    const forms: PluralForms = {
      one: "carte",
      few: "cărți",
      many: "de cărți",
      other: "cărți"
    };

    it("singular form (1)", () => {
      expect(pluralRules.ro(1, forms)).toBe("carte");
    });

    it("few form (2-19)", () => {
      expect(pluralRules.ro(2, forms)).toBe("cărți");
      expect(pluralRules.ro(5, forms)).toBe("cărți");
      expect(pluralRules.ro(19, forms)).toBe("cărți");
    });

    it("many form (20+)", () => {
      expect(pluralRules.ro(20, forms)).toBe("de cărți");
      expect(pluralRules.ro(21, forms)).toBe("de cărți");
      expect(pluralRules.ro(100, forms)).toBe("de cărți");
    });

    it("negative numbers", () => {
      expect(pluralRules.ro(-1, forms)).toBe("carte");
      expect(pluralRules.ro(-5, forms)).toBe("cărți");
      expect(pluralRules.ro(-20, forms)).toBe("de cărți");
    });

    it("zero", () => {
      expect(pluralRules.ro(0, forms)).toBe("cărți");
    });

    it("decimal numbers", () => {
      expect(pluralRules.ro(1.5, forms)).toBe("cărți");
      expect(pluralRules.ro(20.1, forms)).toBe("de cărți");
    });
  });
}); 
/**
 * Test suite for the Russian grammatical number system implementation
 * 
 * This test file verifies the correct implementation of Russian plural rules,
 * which are more complex than English plurals. Russian uses three distinct forms:
 * singular, few, and many, with specific rules for each category.
 * 
 * File Structure:
 * 1. Test Cases Array - Predefined scenarios for different word categories
 *    - Each category (files, images, folders) has its own test suite
 *    - Tests are structured as {num, expected} pairs
 * 2. Negative Numbers Test - Verifies handling of negative values
 * 3. Edge Cases - Tests boundary conditions and special cases
 * 
 * Grammatical Rules Tested:
 * 1. Singular Form (именительный падеж, ед. число)
 *    - Used for numbers ending in 1 (except 11)
 *    - Examples: 1 файл, 21 файл, 101 файл
 * 
 * 2. Few Form (родительный падеж, ед. число)
 *    - Used for numbers ending in 2-4 (except 12-14)
 *    - Examples: 2 файла, 23 файла, 104 файла
 * 
 * 3. Many Form (родительный падеж, мн. число)
 *    - Used for numbers ending in 5-9 or 0
 *    - Used for numbers 11-14
 *    - Used for zero
 *    - Examples: 5 файлов, 11 файлов, 100 файлов
 * 
 * Test Categories:
 * - Files (файл):      masculine inanimate, hard consonant ending
 * - Images (изображение): neuter, soft ending
 * - Folders (папка):    feminine, hard consonant ending
 * 
 * Edge Cases Covered:
 * - Zero (0 файлов)
 * - Negative numbers (-1 файл, -2 файла, etc.)
 * - Decimal numbers (1.5 → 1 файл)
 * - Large numbers (1000001 файл)
 * - Numbers 11-14 (special case: always many form)
 * 
 * Usage Example:
 * ```typescript
 * const forms: [string, string, string] = ['файл', 'файла', 'файлов'];
 * getRussianPlural(1, forms)  // returns 'файл'
 * getRussianPlural(2, forms)  // returns 'файла'
 * getRussianPlural(5, forms)  // returns 'файлов'
 * ```
 * 
 * @see https://en.wikipedia.org/wiki/Russian_grammar#Numerals
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals#Slavic_languages_(Russian,_Serbian,_Ukrainian,_etc.)
 */

import { describe, it, expect } from 'vitest';
import { getRussianPlural } from './utils';

describe('Russian plural system', () => {
  // Test cases for different word forms
  const testCases = [
    {
      category: 'files',
      forms: ['файл', 'файла', 'файлов'] as [string, string, string],
      tests: [
        { num: 1, expected: 'файл' },
        { num: 21, expected: 'файл' },
        { num: 101, expected: 'файл' },
        { num: 2, expected: 'файла' },
        { num: 3, expected: 'файла' },
        { num: 4, expected: 'файла' },
        { num: 22, expected: 'файла' },
        { num: 23, expected: 'файла' },
        { num: 24, expected: 'файла' },
        { num: 5, expected: 'файлов' },
        { num: 0, expected: 'файлов' },
        { num: 11, expected: 'файлов' },
        { num: 12, expected: 'файлов' },
        { num: 13, expected: 'файлов' },
        { num: 14, expected: 'файлов' },
        { num: 15, expected: 'файлов' },
        { num: 20, expected: 'файлов' },
        { num: 25, expected: 'файлов' },
        { num: 30, expected: 'файлов' },
        { num: 100, expected: 'файлов' },
      ]
    },
    {
      category: 'images',
      forms: ['изображение', 'изображения', 'изображений'] as [string, string, string],
      tests: [
        { num: 1, expected: 'изображение' },
        { num: 21, expected: 'изображение' },
        { num: 2, expected: 'изображения' },
        { num: 3, expected: 'изображения' },
        { num: 4, expected: 'изображения' },
        { num: 5, expected: 'изображений' },
        { num: 11, expected: 'изображений' },
        { num: 12, expected: 'изображений' },
        { num: 15, expected: 'изображений' },
        { num: 20, expected: 'изображений' },
      ]
    },
    {
      category: 'folders',
      forms: ['папка', 'папки', 'папок'] as [string, string, string],
      tests: [
        { num: 1, expected: 'папка' },
        { num: 21, expected: 'папка' },
        { num: 2, expected: 'папки' },
        { num: 3, expected: 'папки' },
        { num: 4, expected: 'папки' },
        { num: 5, expected: 'папок' },
        { num: 11, expected: 'папок' },
        { num: 12, expected: 'папок' },
        { num: 15, expected: 'папок' },
        { num: 20, expected: 'папок' },
      ]
    }
  ];

  // Test negative numbers
  it('handles negative numbers the same as positive', () => {
    const forms: [string, string, string] = ['файл', 'файла', 'файлов'];
    expect(getRussianPlural(-1, forms)).toBe('файл');
    expect(getRussianPlural(-2, forms)).toBe('файла');
    expect(getRussianPlural(-5, forms)).toBe('файлов');
    expect(getRussianPlural(-11, forms)).toBe('файлов');
    expect(getRussianPlural(-21, forms)).toBe('файл');
  });

  // Generate tests for each category
  testCases.forEach(({ category, forms, tests }) => {
    describe(`${category} plural forms`, () => {
      tests.forEach(({ num, expected }) => {
        it(`returns correct form for ${num}`, () => {
          expect(getRussianPlural(num, forms)).toBe(expected);
        });
      });
    });
  });

  // Test edge cases
  describe('edge cases', () => {
    const forms: [string, string, string] = ['файл', 'файла', 'файлов'];

    it('handles zero', () => {
      expect(getRussianPlural(0, forms)).toBe('файлов');
    });

    it('handles large numbers', () => {
      expect(getRussianPlural(1000001, forms)).toBe('файл');
      expect(getRussianPlural(1000002, forms)).toBe('файла');
      expect(getRussianPlural(1000005, forms)).toBe('файлов');
    });

    it('handles decimal numbers by truncating', () => {
      expect(getRussianPlural(1.5, forms)).toBe('файл');
      expect(getRussianPlural(2.5, forms)).toBe('файла');
      expect(getRussianPlural(5.5, forms)).toBe('файлов');
    });
  });
}); 
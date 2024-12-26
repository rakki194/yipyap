import { describe, it, expect } from "vitest";
import { getHungarianArticle } from "./utils";

/**
 * Tests for Hungarian language utilities
 * 
 * Hungarian articles ("a" vs "az") follow specific rules:
 * 1. Words starting with vowels (a, á, e, é, i, í, o, ó, ö, ő, u, ú, ü, ű) use "az"
 * 2. Words starting with consonants use "a"
 * 3. Special cases exist for words starting with "egy-" which use "az"
 * 4. Numbers have specific rules:
 *    - Numbers starting with vowel sounds use "az" (e.g., "egy", "öt")
 *    - Numbers starting with consonant sounds use "a" (e.g., "három", "tíz")
 * 5. The rules are case-insensitive
 * 
 * Test cases cover:
 * - Basic vowel/consonant rules
 * - Special cases with "egy-" prefix
 * - Case sensitivity
 * - Numbers (including negative and decimal)
 * - Edge cases (empty strings, spaces)
 * 
 * The getHungarianArticle function is used in translations to automatically 
 * determine the correct article for dynamic content like model names or folder names.
 * 
 * @example
 * getHungarianArticle("alma") // returns "az" (vowel)
 * getHungarianArticle("kutya") // returns "a" (consonant)
 * getHungarianArticle("egyetem") // returns "az" (special case)
 * getHungarianArticle(5) // returns "az" (öt - starts with vowel)
 */

describe("Hungarian language utilities", () => {
  describe("getHungarianArticle", () => {
    it("should return 'az' for words starting with vowels", () => {
      const vowelWords = ["alma", "élet", "iskola", "őz", "út"];
      vowelWords.forEach((word) => {
        expect(getHungarianArticle(word)).toBe("az");
      });
    });

    it("should return 'a' for words starting with consonants", () => {
      const consonantWords = ["kutya", "macska", "tél", "ház"];
      consonantWords.forEach((word) => {
        expect(getHungarianArticle(word)).toBe("a");
      });
    });

    it("should handle special cases correctly", () => {
      const specialCases = {
        egy: "az",
        egyetlen: "az",
        egyetem: "az",
        egyetemi: "az",
        egyesület: "az",
        egyesült: "az",
        együtt: "az",
      };

      Object.entries(specialCases).forEach(([word, expectedArticle]) => {
        expect(getHungarianArticle(word)).toBe(expectedArticle);
      });
    });

    it("should be case insensitive", () => {
      expect(getHungarianArticle("Alma")).toBe("az");
      expect(getHungarianArticle("ISKOLA")).toBe("az");
      expect(getHungarianArticle("Kutya")).toBe("a");
    });

    it("should handle numbers correctly", () => {
      const numberCases = [
        { input: 1, expected: "az" }, // egy
        { input: 5, expected: "az" }, // öt
        { input: 7, expected: "a" }, // hét
        { input: 10, expected: "a" }, // tíz
        { input: 20, expected: "a" }, // húsz
        { input: 50, expected: "az" }, // ötven
        { input: 100, expected: "a" }, // száz
      ];

      numberCases.forEach(({ input, expected }) => {
        expect(getHungarianArticle(input)).toBe(expected);
      });
    });

    it("should handle edge cases", () => {
      expect(getHungarianArticle("")).toBe("a");
      expect(getHungarianArticle(" ")).toBe("a");
      expect(getHungarianArticle("123")).toBe("a"); // százhuszonhárom
    });

    it("should handle decimal numbers", () => {
      expect(getHungarianArticle(1.5)).toBe("az"); // egy egész öt
      expect(getHungarianArticle(2.1)).toBe("a"); // kettő egész egy
    });

    it("should handle negative numbers", () => {
      expect(getHungarianArticle(-1)).toBe("a"); // mínusz egy
      expect(getHungarianArticle(-5)).toBe("a"); // mínusz öt
    });
  });
});

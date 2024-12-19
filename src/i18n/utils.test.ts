import { describe, it, expect } from "vitest";
import { getHungarianArticle } from "./utils";

describe("Hungarian language utilities", () => {
  describe("getHungarianArticle", () => {
    // Test basic vowel cases
    it('should return "az" for words starting with vowels', () => {
      const vowelWords = ["alma", "élet", "iskola", "őz", "út"];
      vowelWords.forEach((word) => {
        expect(getHungarianArticle(word)).toBe("az");
      });
    });

    // Test basic consonant cases
    it('should return "a" for words starting with consonants', () => {
      const consonantWords = ["kutya", "macska", "tél", "ház"];
      consonantWords.forEach((word) => {
        expect(getHungarianArticle(word)).toBe("a");
      });
    });

    // Test special cases
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

    // Test case insensitivity
    it("should be case insensitive", () => {
      expect(getHungarianArticle("Alma")).toBe("az");
      expect(getHungarianArticle("ISKOLA")).toBe("az");
      expect(getHungarianArticle("Kutya")).toBe("a");
    });

    // Test number handling
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

    // Test edge cases
    it("should handle edge cases", () => {
      expect(getHungarianArticle("")).toBe("a");
      expect(getHungarianArticle(" ")).toBe("a");
      expect(getHungarianArticle("123")).toBe("a"); // százhuszonhárom
    });

    // Test string numbers
    it("should handle string numbers", () => {
      expect(getHungarianArticle("1")).toBe("az"); // egy
      expect(getHungarianArticle("5")).toBe("az"); // öt
      expect(getHungarianArticle("7")).toBe("a"); // hét
    });
  });
});

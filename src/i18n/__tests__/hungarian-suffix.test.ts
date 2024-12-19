import { describe, it, expect } from "vitest";
import { getHungarianSuffix } from "../utils";

/**
 * Tests for the Hungarian vowel harmony suffix system
 * 
 * Hungarian has a vowel harmony system where suffixes must match the vowel type of the word they attach to.
 * Words can contain:
 * - Back vowels (a, á, o, ó, u, ú)
 * - Front vowels (e, é, i, í, ö, ő, ü, ű)
 * - Mixed vowels (usually follow the last vowel)
 * 
 * Common suffix pairs tested:
 * - -ban/-ben (in)
 * - -nak/-nek (to/for) 
 * - -val/-vel (with)
 * 
 * The tests verify:
 * 1. Back vowel words get back vowel suffixes
 * 2. Front vowel words get front vowel suffixes
 * 3. Mixed vowel words follow their last vowel
 * 4. Case insensitivity
 * 5. Handling of words with no vowels
 */
describe("Hungarian suffix system", () => {
  describe("getHungarianSuffix", () => {
    it("should handle back vowel words correctly", () => {
      const backVowelWords = ["asztal", "kutya", "város", "ház"];
      backVowelWords.forEach(word => {
        expect(getHungarianSuffix(word, "ban", "ben")).toBe("ban");
        expect(getHungarianSuffix(word, "nak", "nek")).toBe("nak");
        expect(getHungarianSuffix(word, "val", "vel")).toBe("val");
      });
    });

    it("should handle front vowel words correctly", () => {
      const frontVowelWords = ["szék", "ember", "könyv", "tél"];
      frontVowelWords.forEach(word => {
        expect(getHungarianSuffix(word, "ban", "ben")).toBe("ben");
        expect(getHungarianSuffix(word, "nak", "nek")).toBe("nek");
        expect(getHungarianSuffix(word, "val", "vel")).toBe("vel");
      });
    });

    it("should handle mixed vowel words by last vowel", () => {
      expect(getHungarianSuffix("sofőr", "ban", "ben")).toBe("ben");
      expect(getHungarianSuffix("október", "ban", "ben")).toBe("ben");
      expect(getHungarianSuffix("József", "nak", "nek")).toBe("nek");
    });

    it("should be case insensitive", () => {
      expect(getHungarianSuffix("ASZTAL", "ban", "ben")).toBe("ban");
      expect(getHungarianSuffix("Szék", "ban", "ben")).toBe("ben");
    });

    it("should handle words with no vowels", () => {
      expect(getHungarianSuffix("", "ban", "ben")).toBe("ben");
      expect(getHungarianSuffix("pszt", "ban", "ben")).toBe("ben");
    });
  });
}); 
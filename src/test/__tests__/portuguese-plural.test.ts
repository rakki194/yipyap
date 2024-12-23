/**
 * Test suite for Portuguese grammatical number system
 * 
 * Portuguese has complex plural formation rules that vary based on word endings:
 * 
 * 1. Regular Plurals:
 *    - Add -s: casa → casas
 *    - Words ending in -r/-z/-n: add -es (flor → flores)
 * 
 * 2. Special Cases:
 *    a) Words ending in -ão have three possible plural forms:
 *       - -ões (most common): leão → leões
 *       - -ães: cão → cães
 *       - -ãos: mão → mãos
 * 
 *    b) Words ending in -al/-el/-ol/-ul:
 *       - Remove -l and add -is
 *       - Examples: 
 *         - animal → animais
 *         - papel → papéis
 *         - sol → sóis
 * 
 *    c) Words ending in -il:
 *       - Stressed: remove -il and add -is (fuzil → fuzis)
 *       - Unstressed: remove -l and add -eis (fácil → fáceis)
 * 
 *    d) Words ending in -m:
 *       - Change -m to -ns (jovem → jovens)
 * 
 *    e) Words ending in -s:
 *       - Same form for singular and plural (lápis → lápis)
 * 
 * Test Categories:
 * 1. Basic plural forms (regular -s endings)
 * 2. Special -ão endings with alternative forms
 * 3. Number handling:
 *    - Zero (uses plural form)
 *    - Negative numbers
 *    - Decimal numbers
 * 
 * Usage Example:
 * ```typescript
 * const forms = {
 *   singular: "leão",
 *   plural: "leões",
 *   pluralAlt: "leões grandes"  // For quantities > 10
 * };
 * getPortuguesePlural(1, forms)   // returns "leão"
 * getPortuguesePlural(2, forms)   // returns "leões"
 * getPortuguesePlural(11, forms)  // returns "leões grandes"
 * ```
 * 
 * @see https://en.wikipedia.org/wiki/Portuguese_grammar#Plural
 */

import { describe, it, expect } from "vitest";
import { getPortuguesePlural } from "../../i18n/utils";

describe("Portuguese plural system", () => {
  describe("getPortuguesePlural", () => {
    it("should handle basic plural forms", () => {
      const forms = {
        singular: "arquivo",
        plural: "arquivos"
      };

      expect(getPortuguesePlural(0, forms)).toBe("arquivos");
      expect(getPortuguesePlural(1, forms)).toBe("arquivo");
      expect(getPortuguesePlural(2, forms)).toBe("arquivos");
      expect(getPortuguesePlural(5, forms)).toBe("arquivos");
    });

    it("should handle words ending in -ão", () => {
      const forms = {
        singular: "leão",
        plural: "leões",
        pluralAlt: "leões grandes"
      };

      expect(getPortuguesePlural(1, forms)).toBe("leão");
      expect(getPortuguesePlural(2, forms)).toBe("leões");
      expect(getPortuguesePlural(11, forms)).toBe("leões grandes");
    });

    it("should handle negative numbers", () => {
      const forms = {
        singular: "arquivo",
        plural: "arquivos"
      };

      expect(getPortuguesePlural(-1, forms)).toBe("arquivo");
      expect(getPortuguesePlural(-2, forms)).toBe("arquivos");
    });

    it("should handle decimal numbers", () => {
      const forms = {
        singular: "arquivo",
        plural: "arquivos"
      };

      expect(getPortuguesePlural(1.5, forms)).toBe("arquivos");
      expect(getPortuguesePlural(1.0, forms)).toBe("arquivo");
    });
  });
}); 
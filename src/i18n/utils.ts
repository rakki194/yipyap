/**
 * Determines if a Hungarian word should be prefaced with "a" or "az"
 * Based on Hungarian grammar rules:
 * - Use "az" before words starting with vowels (a, e, i, o, ö, u, ü, á, é, í, ó, ő, ú, ű)
 * - Use "a" before words starting with consonants
 *
 * For numbers:
 * - egy (1) -> az egy
 * - öt (5) -> az öt
 * - hat (6) -> a hat
 * - nyolc (8) -> a nyolc
 * etc.
 */

const HUNGARIAN_NUMBERS: { [key: number]: string } = {
  0: "nulla",
  1: "egy",
  2: "kettő",
  3: "három",
  4: "négy",
  5: "öt",
  6: "hat",
  7: "hét",
  8: "nyolc",
  9: "kilenc",
  10: "tíz",
  20: "húsz",
  30: "harminc",
  40: "negyven",
  50: "ötven",
  60: "hatvan",
  70: "hetven",
  80: "nyolcvan",
  90: "kilencven",
  100: "száz",
  1000: "ezer",
  1000000: "millió",
  1000000000: "milliárd",
};

const VOWELS = new Set([
  "a",
  "á",
  "e",
  "é",
  "i",
  "í",
  "o",
  "ó",
  "ö",
  "ő",
  "u",
  "ú",
  "ü",
  "ű",
]);

function startsWithVowel(word: string): boolean {
  return VOWELS.has(word.toLowerCase().charAt(0));
}

/**
 * Converts a number to its Hungarian word representation
 */
function convertNumberToHungarianWord(num: number): string {
  // Handle special cases first
  if (num === 0) return HUNGARIAN_NUMBERS[0];
  if (Math.abs(num) in HUNGARIAN_NUMBERS)
    return HUNGARIAN_NUMBERS[Math.abs(num)];

  // Handle negative numbers
  if (num < 0) return `mínusz ${convertNumberToHungarianWord(Math.abs(num))}`;

  // Handle decimal numbers
  if (!Number.isInteger(num)) {
    const [intPart, decPart] = num.toString().split(".");
    const intWord = convertNumberToHungarianWord(parseInt(intPart));
    const decWord = decPart
      .split("")
      .map((d) => HUNGARIAN_NUMBERS[parseInt(d)])
      .join(" ");
    return `${intWord} egész ${decWord}`;
  }

  let result = "";
  let n = Math.abs(num);

  // Handle large numbers
  for (const value of [1000000000, 1000000, 1000]) {
    if (n >= value) {
      const count = Math.floor(n / value);
      result += `${count > 1 ? convertNumberToHungarianWord(count) + " " : ""}${
        HUNGARIAN_NUMBERS[value]
      } `;
      n %= value;
    }
  }

  // Handle hundreds
  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    result += `${hundreds > 1 ? HUNGARIAN_NUMBERS[hundreds] + " " : ""}${
      HUNGARIAN_NUMBERS[100]
    } `;
    n %= 100;
  }

  // Handle tens and ones
  if (n > 0) {
    if (n < 10) {
      result += HUNGARIAN_NUMBERS[n];
    } else {
      const tens = Math.floor(n / 10) * 10;
      const ones = n % 10;
      result +=
        HUNGARIAN_NUMBERS[tens] + (ones > 0 ? HUNGARIAN_NUMBERS[ones] : "");
    }
  }

  return result.trim();
}

/**
 * Determines whether a Hungarian word should use "a" or "az" as its article
 */
export function getHungarianArticle(word: string | number): "a" | "az" {
  // Handle numbers by converting them to words first
  if (typeof word === "number" || !isNaN(Number(word))) {
    const num = Number(word);
    const hungarianWord = convertNumberToHungarianWord(num);
    // For negative numbers, we check the first word (mínusz)
    if (num < 0) {
      return "a"; // Because "mínusz" starts with 'm'
    }
    return getHungarianArticle(hungarianWord);
  }

  // Convert to lowercase and trim for consistency
  const lowerWord = word.trim().toLowerCase();

  // Empty string defaults to "a"
  if (!lowerWord) return "a";

  // Special cases where pronunciation differs from spelling
  const specialCases: Record<string, "a" | "az"> = {
    egy: "az",
    egyetlen: "az",
    egyetem: "az",
    egyetemi: "az",
    egyesület: "az",
    egyesült: "az",
    együtt: "az",
  };

  if (specialCases[lowerWord]) {
    return specialCases[lowerWord];
  }

  // Check if word starts with a vowel
  return VOWELS.has(lowerWord[0]) ? "az" : "a";
}

/**
 * Helper function to get the appropriate article for a name/word
 * @param name - The name or word to get the article for
 * @returns "a" or "az" depending on whether the word starts with a vowel
 */
export function getHungarianArticleForWord(name: string): string {
  return startsWithVowel(name) ? "az" : "a";
}

/**
 * Gets the correct Russian plural form based on number
 * @param num The number to get plural form for
 * @param forms Array of [singular, few, many] forms
 * @returns The correct plural form
 */
export function getRussianPlural(num: number, forms: [string, string, string]): string {
  // Truncate decimal numbers to integers
  const n = Math.trunc(Math.abs(num));
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return forms[2]; // many
  }

  if (lastDigit === 1) {
    return forms[0]; // singular
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1]; // few
  }

  return forms[2]; // many
}

/**
 * Gets the correct Arabic plural form for a number
 * Arabic has three number forms:
 * - Singular (1)
 * - Dual (2)
 * - Plural (3-10)
 * - Plural (11+)
 * 
 * @param count The number to get the plural form for
 * @param forms Object containing the different forms [singular, dual, plural]
 * @returns The correct plural form for the number
 */
export function getArabicPlural(
  count: number,
  forms: {
    singular: string;
    dual: string;
    plural: string;
    pluralLarge?: string;
  }
): string {
  const absCount = Math.trunc(Math.abs(count));
  
  if (absCount === 0) return forms.plural;
  if (absCount === 1) return forms.singular;
  if (absCount === 2) return forms.dual;
  if (absCount >= 3 && absCount <= 10) return forms.plural;
  return forms.pluralLarge || forms.plural;
}

/**
 * Determines the correct form of a Hungarian suffix based on vowel harmony
 * 
 * Hungarian words can be categorized into:
 * - Back vowel words (a, á, o, ó, u, ú)
 * - Front vowel words (e, é, i, í, ö, ő, ü, ű)
 * - Mixed vowel words (usually follow the last vowel)
 * 
 * Common suffix pairs:
 * -ban/-ben (in)
 * -nak/-nek (to/for)
 * -val/-vel (with)
 * -ra/-re (onto)
 * -ba/-be (into)
 * etc.
 * 
 * @param word The base word
 * @param backSuffix The suffix form for back vowel words (e.g., "ban")
 * @param frontSuffix The suffix form for front vowel words (e.g., "ben")
 * @returns The appropriate suffix form
 */
export function getHungarianSuffix(
  word: string,
  backSuffix: string,
  frontSuffix: string
): string {
  // Define vowel groups
  const backVowels = ['a', 'á', 'o', 'ó', 'u', 'ú'];
  const frontVowels = ['e', 'é', 'i', 'í', 'ö', 'ő', 'ü', 'ű'];
  
  // Convert to lowercase for comparison
  const lowerWord = word.toLowerCase();
  
  // Find the last vowel in the word
  let lastVowel = '';
  for (let i = lowerWord.length - 1; i >= 0; i--) {
    if (backVowels.includes(lowerWord[i])) {
      return backSuffix;
    } else if (frontVowels.includes(lowerWord[i])) {
      return frontSuffix;
    }
  }
  
  // If no vowels found, default to front vowel form
  return frontSuffix;
}

/**
 * Determines the correct Portuguese plural form based on number
 * 
 * Portuguese plural rules:
 * - Words ending in -ão have three possible plural forms:
 *   - -ões (most common): leão → leões
 *   - -ães: cão → cães
 *   - -ãos: mão → mãos
 * - Words ending in -al, -el, -ol, -ul: remove -l and add -is
 *   - animal → animais
 *   - papel → papéis
 * - Words ending in -il: 
 *   - Stressed: remove -il and add -is (fuzil → fuzis)
 *   - Unstressed: remove -l and add -eis (fácil → fáceis)
 * - Words ending in -m: change -m to -ns
 *   - jovem → jovens
 * 
 * @param num The number to determine plural form for
 * @param forms Object containing different plural forms
 * @returns The appropriate plural form
 */
export function getPortuguesePlural(
  num: number,
  forms: {
    singular: string;
    plural: string;
    pluralAlt?: string;  // For words with alternative plural forms
  }
): string {
  // Handle zero case
  if (num === 0) return forms.plural;
  
  // Handle singular case
  if (Math.abs(num) === 1) return forms.singular;
  
  // Handle special plural cases if alternative form exists
  if (forms.pluralAlt && /ão$/.test(forms.singular)) {
    // For numbers above 10, use alternative plural form if available
    if (Math.abs(num) > 10) return forms.pluralAlt;
  }
  
  // Default plural form
  return forms.plural;
}

/**
 * Gets the correct Polish plural form based on the number
 * 
 * Polish has 3 plural forms:
 * 1. Singular (1)
 * 2. Plural for 2-4 (except 12-14)
 * 3. Plural for 0, 5-21, and numbers ending in 5-9
 * 
 * @example
 * getPolishPlural(1, {
 *   singular: "plik",
 *   plural2_4: "pliki",
 *   plural5_: "plików"
 * }) // returns "plik"
 */
export function getPolishPlural(
  count: number,
  forms: {
    singular: string;
    plural2_4: string;
    plural5_: string;
  }
): string {
  // Get absolute value and last digit
  const absCount = Math.abs(Math.floor(count));
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Special case for teens (12-14)
  if (lastTwoDigits > 11 && lastTwoDigits < 15) {
    return forms.plural5_;
  }

  // Singular case
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return forms.singular;
  }

  // 2-4 case (except 12-14)
  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms.plural2_4;
  }

  // All other cases (0, 5-9, teens)
  return forms.plural5_;
}

/**
 * Get the correct Spanish plural form based on quantity
 * 
 * @param count - The quantity
 * @param forms - Object containing singular and plural forms
 * @returns The correct plural form for the given quantity
 */
export function getSpanishPlural(
  count: number,
  forms: { singular: string; plural: string }
): string {
  // Handle negative numbers and decimals by using absolute value and truncating
  const n = Math.abs(Math.trunc(count));
  
  // Spanish uses singular form only for exactly 1
  return n === 1 ? forms.singular : forms.plural;
}

/**
 * Gets the correct Turkish plural form based on vowel harmony rules
 * 
 * Turkish has two plural suffixes: -lar and -ler
 * The choice depends on the last vowel in the word:
 * - Back vowels (a, ı, o, u) take -lar
 * - Front vowels (e, i, ö, ü) take -ler
 * 
 * @param word The word to pluralize
 * @param forms Object containing singular and plural forms
 * @returns The appropriate plural form
 */
export function getTurkishPlural(
  word: string,
  forms: {
    singular: string;
    pluralLar: string;  // for back vowels
    pluralLer: string;  // for front vowels
  }
): string {
  // Back vowels: a, ı, o, u
  const backVowels = ['a', 'ı', 'o', 'u'];
  // Front vowels: e, i, ö, ü
  const frontVowels = ['e', 'i', 'ö', 'ü'];
  
  // Find the last vowel in the word
  const letters = word.toLowerCase().split('');
  for (let i = letters.length - 1; i >= 0; i--) {
    if (backVowels.includes(letters[i])) {
      return forms.pluralLar;
    }
    if (frontVowels.includes(letters[i])) {
      return forms.pluralLer;
    }
  }
  
  // Default to -ler if no vowels found
  return forms.pluralLer;
}

/**
 * Gets the correct Czech plural form based on the number
 * 
 * Czech has 3 plural forms:
 * 1. Singular (1): soubor
 * 2. Plural for 2-4: soubory
 * 3. Plural for 0, 5+: souborů
 * 
 * @example
 * getCzechPlural(1, {
 *   singular: "soubor",
 *   plural2_4: "soubory",
 *   plural5_: "souborů"
 * }) // returns "soubor"
 */
export function getCzechPlural(
  count: number,
  forms: {
    singular: string;
    plural2_4: string;
    plural5_: string;
  }
): string {
  // Get absolute value and last digit
  const absCount = Math.abs(Math.floor(count));
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Singular case (1, but not 11)
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return forms.singular;
  }

  // 2-4 case (but not 12-14)
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return forms.plural2_4;
  }

  // All other cases (0, 5-9, teens)
  return forms.plural5_;
}

/**
 * Gets the correct plural form for Romanian based on count.
 * Romanian has three forms:
 * - Singular (1): carte
 * - Few (2-19): cărți
 * - Many (20+): de cărți
 * 
 * Special cases:
 * - Zero uses the few form: cărți
 * - Decimal numbers follow the same rules as integers:
 *   - If < 20: cărți
 *   - If >= 20: de cărți
 * 
 * @param count The number to get plural form for
 * @param forms Object containing the three plural forms
 * @returns The correct plural form
 */
export function getRomanianPlural(
  count: number,
  forms: { one: string; few: string; many: string }
): string {
  const absCount = Math.abs(count);
  
  // Handle zero
  if (count === 0) {
    return forms.few;
  }
  
  // Handle exact 1
  if (absCount === 1 && Number.isInteger(count)) {
    return forms.one;
  }
  
  // Handle numbers >= 20 (including decimals)
  if (absCount >= 20) {
    return forms.many;
  }
  
  // All other cases (2-19 and decimals < 20)
  return forms.few;
}

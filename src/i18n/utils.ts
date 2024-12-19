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
  0: 'nulla',
  1: 'egy',
  2: 'kettő',
  3: 'három',
  4: 'négy', 
  5: 'öt',
  6: 'hat',
  7: 'hét',
  8: 'nyolc',
  9: 'kilenc',
  10: 'tíz',
  20: 'húsz',
  30: 'harminc',
  40: 'negyven',
  50: 'ötven',
  60: 'hatvan',
  70: 'hetven',
  80: 'nyolcvan',
  90: 'kilencven',
  100: 'száz',
  1000: 'ezer',
  1000000: 'millió',
  1000000000: 'milliárd'
};

const VOWELS = new Set(['a', 'á', 'e', 'é', 'i', 'í', 'o', 'ó', 'ö', 'ő', 'u', 'ú', 'ü', 'ű']);

function startsWithVowel(word: string): boolean {
  return VOWELS.has(word.toLowerCase().charAt(0));
}

function convertNumberToHungarianWord(num: number): string {
  // Handle special cases
  if (num === 0) return HUNGARIAN_NUMBERS[0];
  if (Math.abs(num) in HUNGARIAN_NUMBERS) return HUNGARIAN_NUMBERS[Math.abs(num)];

  // Handle negative numbers
  if (num < 0) return `mínusz ${convertNumberToHungarianWord(Math.abs(num))}`;

  // Handle decimal numbers
  if (!Number.isInteger(num)) {
    const [intPart, decPart] = num.toString().split('.');
    return `${convertNumberToHungarianWord(parseInt(intPart))} egész ${convertNumberToHungarianWord(parseInt(decPart))}`;
  }

  let result = '';
  let n = Math.abs(num);

  // Handle billions
  if (n >= 1000000000) {
    const billions = Math.floor(n / 1000000000);
    result += `${billions > 1 ? convertNumberToHungarianWord(billions) + ' ' : ''}${HUNGARIAN_NUMBERS[1000000000]} `;
    n %= 1000000000;
  }

  // Handle millions
  if (n >= 1000000) {
    const millions = Math.floor(n / 1000000);
    result += `${millions > 1 ? convertNumberToHungarianWord(millions) + ' ' : ''}${HUNGARIAN_NUMBERS[1000000]} `;
    n %= 1000000;
  }

  // Handle thousands
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    result += `${thousands > 1 ? convertNumberToHungarianWord(thousands) + ' ' : ''}${HUNGARIAN_NUMBERS[1000]} `;
    n %= 1000;
  }

  // Handle hundreds
  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    result += `${hundreds > 1 ? convertNumberToHungarianWord(hundreds) + ' ' : ''}${HUNGARIAN_NUMBERS[100]} `;
    n %= 100;
  }

  // Handle tens and ones
  if (n > 0) {
    if (n < 10) {
      result += HUNGARIAN_NUMBERS[n];
    } else {
      const tens = Math.floor(n / 10) * 10;
      const ones = n % 10;
      result += HUNGARIAN_NUMBERS[tens];
      if (ones > 0) {
        result += HUNGARIAN_NUMBERS[ones];
      }
    }
  }

  return result.trim();
}

/**
 * Returns the appropriate Hungarian article ("a" or "az") for a number
 * @param num - The number to get the article for
 * @returns "a" or "az" depending on the Hungarian pronunciation of the number
 */
export function getHungarianArticle(num: number): string {
  const hungarianWord = convertNumberToHungarianWord(num);
  return startsWithVowel(hungarianWord) ? 'az' : 'a';
}

/**
 * Helper function to get the appropriate article for a name/word
 * @param name - The name or word to get the article for
 * @returns "a" or "az" depending on whether the word starts with a vowel
 */
export function getHungarianArticleForWord(name: string): string {
  return startsWithVowel(name) ? 'az' : 'a';
} 
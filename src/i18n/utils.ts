/**
 * Converts a number to its Hungarian word representation
 * @param num The number to convert
 * @returns The Hungarian word for the number
 */
function numberToHungarianWord(num: number): string {
  const numbers: Record<number, string> = {
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
    100: 'száz'
  };

  // Handle numbers up to 100
  if (num <= 100) {
    if (numbers[num]) return numbers[num];
    
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    
    if (ones === 0) return numbers[tens];
    return `${numbers[tens]}${numbers[ones]}`;
  }

  return num.toString();
}

/**
 * Determines whether a Hungarian word should use "a" or "az" as its article
 * @param word The word or number to check
 * @returns "a" or "az"
 */
export function getHungarianArticle(word: string | number): "a" | "az" {
  // Handle numbers
  if (typeof word === 'number' || !isNaN(Number(word))) {
    const num = Number(word);
    return getHungarianArticle(numberToHungarianWord(num));
  }

  // Convert to lowercase for consistency
  const lowerWord = word.trim().toLowerCase();
  
  // Empty string or no word should default to "a"
  if (!lowerWord) return "a";

  // List of Hungarian vowels (including long vowels)
  const vowels = ['a', 'á', 'e', 'é', 'i', 'í', 'o', 'ó', 'ö', 'ő', 'u', 'ú', 'ü', 'ű'];
  
  // Special cases where the written form doesn't match pronunciation
  const specialCases: Record<string, "a" | "az"> = {
    'egy': 'az',
    'egyetlen': 'az',
    'egyetem': 'az',
    'egyetemi': 'az',
    'egyesület': 'az',
    'egyesült': 'az',
    'együtt': 'az',
    // Add more special cases as needed
  };

  // Check special cases first
  if (specialCases[lowerWord]) {
    return specialCases[lowerWord];
  }

  // Check if the word starts with a vowel
  return vowels.includes(lowerWord[0]) ? "az" : "a";
} 
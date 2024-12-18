import { getHungarianArticle } from './utils';
import { describe, expect, test } from 'vitest';

describe('getHungarianArticle', () => {
  // Test basic vowel cases
  test('should return "az" for words starting with vowels', () => {
    const vowelWords = [
      'alma', 'áram', 'elem', 'élet', 'ing', 'írás', 
      'oldal', 'óra', 'öröm', 'őr', 'út', 'új', 'üzlet', 'űr'
    ];
    
    vowelWords.forEach(word => {
      expect(getHungarianArticle(word)).toBe('az');
    });
  });

  // Test basic consonant cases
  test('should return "a" for words starting with consonants', () => {
    const consonantWords = [
      'béka', 'cica', 'dió', 'fa', 'gyerek', 'hal', 
      'jég', 'kutya', 'lyuk', 'macska', 'nyúl', 'pont',
      'róka', 'szék', 'tyúk', 'váza', 'zene', 'zseb'
    ];
    
    consonantWords.forEach(word => {
      expect(getHungarianArticle(word)).toBe('a');
    });
  });

  // Test special cases
  test('should handle special "egy-" cases correctly', () => {
    const egyWords = [
      'egy',
      'egyetlen',
      'egyetem',
      'egyetemi',
      'egyesület',
      'egyesült',
      'együtt'
    ];

    egyWords.forEach(word => {
      expect(getHungarianArticle(word)).toBe('az');
    });
  });

  // Test edge cases
  test('should handle edge cases', () => {
    // Empty string
    expect(getHungarianArticle('')).toBe('a');
    
    // Whitespace
    expect(getHungarianArticle(' ')).toBe('a');
    expect(getHungarianArticle('  alma  ')).toBe('az');
    
    // Case insensitivity
    expect(getHungarianArticle('Alma')).toBe('az');
    expect(getHungarianArticle('ALMA')).toBe('az');
    expect(getHungarianArticle('Béka')).toBe('a');
    expect(getHungarianArticle('BÉKA')).toBe('a');
    
    // Numbers
    expect(getHungarianArticle('1')).toBe('az');
    expect(getHungarianArticle('2')).toBe('a');
    expect(getHungarianArticle('5')).toBe('az');
    expect(getHungarianArticle('10')).toBe('a');
  });

  // Test with actual file and folder names
  test('should handle typical file and folder names', () => {
    // Files
    expect(getHungarianArticle('image.jpg')).toBe('az');
    expect(getHungarianArticle('document.pdf')).toBe('a');
    expect(getHungarianArticle('test_file.txt')).toBe('a');
    
    // Folders
    expect(getHungarianArticle('Images')).toBe('az');
    expect(getHungarianArticle('Documents')).toBe('a');
    expect(getHungarianArticle('Desktop')).toBe('a');
  });

  // Test with full paths
  test('should handle file paths correctly', () => {
    expect(getHungarianArticle('/home/user/images/test.jpg')).toBe('a');
    expect(getHungarianArticle('C:\\Users\\Documents\\example.pdf')).toBe('az');
  });

  // Test numerical values
  test('should handle numbers correctly', () => {
    const numberTests: [number | string, "a" | "az"][] = [
      [1, 'az'],    // egy
      [2, 'a'],     // kettő
      [5, 'az'],    // öt
      [11, 'a'],    // tizenegy
      [20, 'a'],    // húsz
      [50, 'az'],   // ötven
      [55, 'az'],   // ötvenöt
      [100, 'a'],   // száz
      ['1', 'az'],  // egy (string)
      ['5', 'az'],  // öt (string)
      ['10', 'a'],  // tíz (string)
    ];

    numberTests.forEach(([num, expected]) => {
      expect(getHungarianArticle(num)).toBe(expected);
    });
  });

  // Test edge cases with numbers
  test('should handle number edge cases', () => {
    expect(getHungarianArticle(0)).toBe('a');     // nulla
    expect(getHungarianArticle('0')).toBe('a');   // nulla
    expect(getHungarianArticle(NaN)).toBe('a');   // should default to "a"
    expect(getHungarianArticle(Infinity)).toBe('a'); // should default to "a"
    expect(getHungarianArticle(-1)).toBe('a');    // mínusz egy
    expect(getHungarianArticle(1.5)).toBe('a');   // egy egész öt
  });
}); 
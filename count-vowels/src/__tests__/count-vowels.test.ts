import {describe, expect, it} from 'vitest';
import {countVowels} from '../count-vowels';

describe('count-vowels', () => {
  it('countVowels counts vowels in lowercase string', () => {
    expect(countVowels('hello')).toEqual(2);
  });

  it('countVowels counts vowels in uppercase string', () => {
    expect(countVowels('WORLD')).toEqual(1);
  });

  it('countVowels counts vowels in mixed case string', () => {
    expect(countVowels('HELLo')).toEqual(2);
  });

  it('countVowels returns 0 for string with no vowels', () => {
    expect(countVowels('xyz')).toEqual(0);
  });

  it('countVowels counts all vowels in string', () => {
    expect(countVowels('The quick brown fox jumps over the lazy dog.')).toEqual(11);
  });

  it('countVowels returns 0 for empty string', () => {
    expect(countVowels('')).toEqual(0);
  });
});

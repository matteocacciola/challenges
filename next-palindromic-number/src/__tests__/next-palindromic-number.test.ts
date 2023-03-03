import {describe, expect, it} from 'vitest';
import {nextPalindrome} from '../next-palindromic-number';

describe('next-palindromic-number', () => {
  it.each([
    [235, 242],
    [23534, 23632],
    [121, 121],
    [1221, 1221],
    [45, 55],
    [9687, 9779],
    [12231, 12321],
    [1234567887654322, 1234567997654321],
  ])('returns the next palindromic number for simple input: %p', (input, expected) => {
    expect(nextPalindrome(input)).toEqual(expected);
  });
});

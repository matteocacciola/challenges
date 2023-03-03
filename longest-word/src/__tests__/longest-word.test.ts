import {describe, expect, it} from 'vitest';
import {longestWord} from '../longest-word';

describe('longest-word', () => {
  it.each([
    ['fun;time12312312', 'time12312312'],
    ['fun;Time12312312', 'Time12312312'],
    ['fun,time', 'time'],
    ['fun&!! time', 'time'],
    ['I love dogs', 'love'],
    [';I love dogs', 'love'],
    [';I lov dogs;', 'dogs'],
  ])('returns the longest word for simple input: %p', (input, expected) => {
    expect(longestWord(input)).toEqual(expected);
  });
});

import {describe, expect, it} from 'vitest';
import {loneliestNumber} from "../loneliest";

describe('loneliest', () => {
  it.each([
    [23456, 2],
    [42435, 2],
    [34315, 1],
    [212, 2]
  ])('returns the loneliest digit for simple input: %p', (input, expected) => {
    expect(loneliestNumber(input)).toEqual(expected);
  });

  it('returns the highest value digit if there are multiple with the same loneliness score', () => {
    expect(loneliestNumber(111)).toEqual(1);
  });

  it('returns the digit with a loneliness score of 0 if the input is a single digit', () => {
    expect(loneliestNumber(7)).toEqual(7);
  });

  it('returns the loneliest digit for an input with repeating digits', () => {
    expect(loneliestNumber(111222333)).toEqual(1);
  });

  it('returns the loneliest digit for an input with consecutive digits', () => {
    expect(loneliestNumber(987654321)).toEqual(1);
  });
});

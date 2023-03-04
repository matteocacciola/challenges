import {describe, expect, it} from 'vitest';
import {describeFunction} from '../describe-function';

describe('describe-function', () => {
  it.each([
    [1, 2, 3, '+'],
    [10, 5, 5, '-'],
    [10, 4, 40, '*'],
    [9, 5, 1.8, '/'],
    [47, 30, 1410, '*']
  ])('test with inputs: %p, %p, %p', (a, b, c, op) => {
    expect(describeFunction(a, b, c)).toEqual(op);
  });
});

import {describe, expect, it} from 'vitest';
import {booleanToString} from '../boolean-to-string';

describe('boolean-to-string', () => {
  it.each([
    ['false', false],
    ['true', true],
    ['false', undefined],
    ['false', null]
  ])('boolean to string', (s: string, b?: boolean | null) => {
    expect(booleanToString(b)).toStrictEqual(s);
  });
});

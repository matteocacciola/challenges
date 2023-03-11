import {describe, expect, it} from 'vitest';
import {obfuscatePhoneNumber} from '../obfuscate-phone-number';

describe('describe-function', () => {
  it.each([
    ['201-680-0202', '201-6XX-XXXX'],
    ['145-201-680-0202', ''],
  ])('test with inputs: %p', (phone, expected) => {
    expect(obfuscatePhoneNumber(phone)).toEqual(expected);
  });
});

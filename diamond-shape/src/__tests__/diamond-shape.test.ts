import {describe, expect, it} from 'vitest';
import {diamondShape} from '../diamond-shape';

describe('diamond-shape', () => {
  it('returns null for even numbers', () => {
    expect(diamondShape(2)).toBeNull();
    expect(diamondShape(4)).toBeNull();
    expect(diamondShape(10)).toBeNull();
  });

  it('returns null for negative numbers', () => {
    expect(diamondShape(-1)).toBeNull();
    expect(diamondShape(-5)).toBeNull();
    expect(diamondShape(-9)).toBeNull();
  });

  it('returns the expected diamond shape for odd numbers', () => {
    expect(diamondShape(1)).toBe("*\n");
    expect(diamondShape(3)).toBe(" *\n***\n *\n");
    expect(diamondShape(5)).toBe("  *\n ***\n*****\n ***\n  *\n");
    expect(diamondShape(7)).toBe("   *\n  ***\n *****\n*******\n *****\n  ***\n   *\n");
    expect(diamondShape(9)).toBe("    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *\n");

  });
});

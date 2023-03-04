import {describe, expect, it} from 'vitest';
import {stockList} from '../stock-list';

describe('stockList', () => {
  it('returns empty string when given empty lists', () => {
    const result = stockList([], []);
    expect(result).toEqual('');
  });

  it('returns zero quantities for all categories when no books match any categories', () => {
    const result = stockList(['ABC 10', 'DEF 20', 'GHI 30'], ['X', 'Y', 'Z']);
    expect(result).toEqual('(X : 0) - (Y : 0) - (Z : 0)');
  });

  it('returns correct totals for all categories when all books match at least one category', () => {
    const result = stockList(
      ['ABART 20', 'CDXEF 50', 'BKWRK 25', 'BTSQZ 89', 'DRTYM 60'],
      ['A', 'B', 'C', 'W']
    );
    expect(result).toEqual('(A : 20) - (B : 114) - (C : 50) - (W : 0)');
  });

  it('returns correct totals for some categories when some books match more than one category', () => {
    const result = stockList(
      ['ABCD 10', 'BCDE 20', 'CDEF 30', 'DEFG 40', 'EFGH 50', 'FGHI 60'],
      ['B', 'C', 'D', 'E']
    );
    expect(result).toEqual('(B : 20) - (C : 30) - (D : 40) - (E : 50)');
  });
});

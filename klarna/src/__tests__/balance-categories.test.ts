import { describe, expect, it } from 'vitest';
import { getBalanceByCategoryInPeriod, Transaction } from '../balance-categories';

describe('getBalanceByCategoryInPeriod()', () => {
  const transactions: Transaction[] = [
    {
      id: '11ff73b5-e771-441c-886a-498d93b5093d',
      sourceAccount: 'my_account',
      targetAccount: 'restaurant',
      amount: -9600,
      currency: 'EUR',
      category: 'eating_out',
      time: '2021-04-08T05:15:56.905Z',
    },
    {
      id: '8c3ec38d-1821-4d49-aef1-2385cb3c2b1b',
      sourceAccount: 'my_account',
      targetAccount: 'cinema',
      amount: -5700,
      currency: 'EUR',
      category: 'entertainment',
      time: '2021-04-07T21:16:57.819Z',
    },
    {
      id: 'd1c77d7c-ccda-453c-ac01-444e9d5abca3',
      sourceAccount: 'my_account',
      targetAccount: 'book_store',
      amount: -7400,
      currency: 'EUR',
      category: 'entertainment',
      time: '2021-04-07T22:46:44.071Z',
    },
    {
      id: '837127ab-f523-4b11-bed3-ae488be4545d',
      sourceAccount: 'my_account',
      targetAccount: 'fitness_club',
      amount: -9200,
      currency: 'EUR',
      category: 'sports',
      time: '2021-04-05T01:55:16.646Z',
    },
  ];

  it('returns the correct balance matching a category in specified period', () => {
    expect(
      getBalanceByCategoryInPeriod(
        transactions,
        ['sports', 'entertainment'],
        new Date('2021-04-01'),
        new Date('2021-04-30')
      )
    ).toEqual({ sports: -9200, entertainment: -13100 });
  });

  it('returns zero balances for all categories when no transaction has one of provided categories', () => {
    expect(
      getBalanceByCategoryInPeriod(
        transactions,
        ['groceries', 'income'],
        new Date('2021-04-01'),
        new Date('2021-04-30')
      )
    ).toEqual({ groceries: 0, income: 0 });
  });

  it('returns zero balances for all categories when transaction list is empty', () => {
    expect(
      getBalanceByCategoryInPeriod(
        [],
        ['sports', 'entertainment'],
        new Date('2021-04-01'),
        new Date('2021-04-30')
      )
    ).toEqual({ sports: 0, entertainment: 0 });
  });

  it('returns balances only for a specific category', () => {
    expect(
      getBalanceByCategoryInPeriod(
        transactions,
        ['sports'],
        new Date('2021-04-01'),
        new Date('2021-04-30')
      )
    ).toEqual({ sports: -9200 });
  });

  it('returns zero balances for all categories when transactions are not within the time range', () => {
    expect(
      getBalanceByCategoryInPeriod(
        transactions,
        ['sports', 'entertainment'],
        new Date('2021-03-13'),
        new Date('2021-03-16')
      )
    ).toEqual({ sports: 0, entertainment: 0 });
  });

  it('returns empty object when no category is specified', () => {
    expect(
      getBalanceByCategoryInPeriod(
        transactions,
        [],
        new Date('2021-04-01'),
        new Date('2021-04-30')
      )
    ).toEqual({});
  });

  it('returns empty object when start date is in the future', () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    expect(
      getBalanceByCategoryInPeriod(
        transactions,
        ['sports', 'entertainment'],
        start,
        new Date('2021-04-30')
      )
    ).toEqual({});
  });

  it('returns the correct balance matching a category in specified period, with some transactions outside the period', () => {
    expect(
      getBalanceByCategoryInPeriod(
        [...transactions, {
          id: '11ff73b5-e771-441c-886a-498d93b5093e',
          sourceAccount: 'my_account',
          targetAccount: 'restaurant',
          amount: -9600,
          currency: 'EUR',
          category: 'eating_out',
          time: '2021-05-08T05:15:56.905Z',
        }],
        ['sports', 'entertainment'],
        new Date('2021-04-01'),
        new Date('2021-04-30')
      )
    ).toEqual({ sports: -9200, entertainment: -13100 });
  });

  it('returns balances for multiple categories within specified period with transactions overlapping', () => {
    const transactionsWithOverlap = [
      {
        id: '1',
        sourceAccount: 'my_account',
        targetAccount: 'coffee_shop',
        amount: -350,
        currency: 'EUR',
        category: 'eating_out',
        time: '2021-03-13T12:00:00Z'
      },
      {
        id: '2',
        sourceAccount: 'my_account',
        targetAccount: 'supermarket',
        amount: -1500,
        currency: 'EUR',
        category: 'groceries',
        time: '2021-03-14T18:00:00Z'
      },
      {
        id: '3',
        sourceAccount: 'my_account',
        targetAccount: 'salary',
        amount: 400000,
        currency: 'EUR',
        category: 'income',
        time: '2021-03-15T18:00:00Z'
      },
      {
        id: '4',
        sourceAccount: 'my_account',
        targetAccount: 'bookstore',
        amount: -2500,
        currency: 'EUR',
        category: 'shopping',
        time: '2021-03-16T16:45:00Z'
      },
      {
        id: '5',
        sourceAccount: 'my_account',
        targetAccount: 'coffee_shop',
        amount: -500,
        currency: 'EUR',
        category: 'eating_out',
        time: '2021-03-16T12:00:00Z'
      },
      {
        id: '6',
        sourceAccount: 'my_account',
        targetAccount: 'supermarket',
        amount: -1000,
        currency: 'EUR',
        category: 'groceries',
        time: '2021-03-17T09:00:00Z'
      },
      {
        id: '7',
        sourceAccount: 'my_account',
        targetAccount: 'salary',
        amount: 400000,
        currency: 'EUR',
        category: 'income',
        time: '2021-03-18T18:00:00Z'
      }
    ];
    const categories = ['eating_out', 'groceries', 'income', 'shopping'];
    const startTime = new Date('2021-03-13T00:00:00Z');
    const endTime = new Date('2021-03-17T00:00:00Z');
    const expectedBalances = {
      eating_out: -850,
      groceries: -1500,
      income: 400000,
      shopping: -2500
    };
    const actualBalances = getBalanceByCategoryInPeriod(transactionsWithOverlap, categories, startTime, endTime);
    expect(actualBalances).toEqual(expectedBalances);
  });
});
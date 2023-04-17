import { describe, expect, it } from 'vitest';
import { categorizeSimilarTransactions } from '../categorize-similar-transactions';

describe('categorizeSimilarTransactions()', () => {
  // These are example tests. Please add your own tests if needed
  it('returns empty array if transactions is empty', () => {
    expect(categorizeSimilarTransactions([])).toEqual([]);
  });

  it('enhances categorization when there are similar transactions', () => {
    expect(
      categorizeSimilarTransactions([
        {
          id: 'a001bb66-6f4c-48bf-8ae0-f73453aa8dd5',
          sourceAccount: 'my_account',
          targetAccount: 'coffee_shop',
          amount: -620,
          time: '2021-04-10T10:30:00Z',
        },
        {
          id: 'bfd6a11a-2099-4b69-a7bb-572d8436cf73',
          sourceAccount: 'my_account',
          targetAccount: 'coffee_shop',
          amount: -350,
          category: 'eating_out',
          time: '2021-03-12T12:34:00Z',
        },
        {
          id: 'a8170ced-1c5f-432c-bb7d-867589a9d4b8',
          sourceAccount: 'my_account',
          targetAccount: 'coffee_shop',
          amount: -1690,
          time: '2021-04-12T08:20:00Z',
        },
      ])
    ).toEqual([
      {
        id: 'a001bb66-6f4c-48bf-8ae0-f73453aa8dd5',
        sourceAccount: 'my_account',
        targetAccount: 'coffee_shop',
        amount: -620,
        category: 'eating_out',
        time: '2021-04-10T10:30:00Z',
      },
      {
        id: 'bfd6a11a-2099-4b69-a7bb-572d8436cf73',
        sourceAccount: 'my_account',
        targetAccount: 'coffee_shop',
        amount: -350,
        category: 'eating_out',
        time: '2021-03-12T12:34:00Z',
      },
      {
        id: 'a8170ced-1c5f-432c-bb7d-867589a9d4b8',
        sourceAccount: 'my_account',
        targetAccount: 'coffee_shop',
        amount: -1690,
        time: '2021-04-12T08:20:00Z',
      },
    ]);
  });

  it('should not categorize any transactions if there are no uncategorized transactions', () => {
    const transactions = [
      {
        id: '1',
        currency: 'EUR',
        amount: 100,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '2',
        currency: 'EUR',
        amount: 50,
        targetAccount: '5678',
        category: 'Entertainment'
      }
    ];

    const categorizedTransactions = categorizeSimilarTransactions(transactions);

    expect(categorizedTransactions).toEqual(transactions);
  });

  it('should not categorize uncategorized transactions if there is no similar transaction in the categorized transactions', () => {
    const transactions = [
      {
        id: '1',
        currency: 'EUR',
        amount: 100,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '2',
        currency: 'EUR',
        amount: 50,
        targetAccount: '5678',
        category: 'Entertainment'
      },
      {
        id: '3',
        currency: 'EUR',
        amount: 150,
        targetAccount: '9012'
      }
    ];

    const categorizedTransactions = categorizeSimilarTransactions(transactions);

    expect(categorizedTransactions).toEqual([
      {
        id: '1',
        currency: 'EUR',
        amount: 100,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '2',
        currency: 'EUR',
        amount: 50,
        targetAccount: '5678',
        category: 'Entertainment'
      },
      {
        id: '3',
        currency: 'EUR',
        amount: 150,
        targetAccount: '9012'
      }
    ]);
  });

  it('should categorize an uncategorized transaction with the closest amount to a similar transaction', () => {
    const transactions = [
      {
        id: '1',
        currency: 'EUR',
        amount: 100,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '2',
        currency: 'EUR',
        amount: 50,
        targetAccount: '5678',
        category: 'Entertainment'
      },
      {
        id: '3',
        currency: 'EUR',
        amount: 130,
        targetAccount: '1234'
      },
      {
        id: '4',
        currency: 'EUR',
        amount: 90,
        targetAccount: '5678'
      }
    ];

    const categorizedTransactions = categorizeSimilarTransactions(transactions);

    expect(categorizedTransactions).toEqual([
      {
        id: '1',
        currency: 'EUR',
        amount: 100,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '2',
        currency: 'EUR',
        amount: 50,
        targetAccount: '5678',
        category: 'Entertainment'
      },
      {
        id: '3',
        currency: 'EUR',
        amount: 130,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '4',
        currency: 'EUR',
        amount: 90,
        targetAccount: '5678',
        category: 'Entertainment'
      }
    ]);
  });

  it('should categorize an uncategorized transaction with the closest amount within 1000 units to a similar transaction', () => {
    const transactions = [
      {
        id: '1',
        currency: 'EUR',
        amount: 1000,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '2',
        currency: 'EUR',
        amount: 500,
        targetAccount: '5678',
        category: 'Entertainment'
      },
      {
        id: '3',
        currency: 'EUR',
        amount: 1200,
        targetAccount: '1234'
      }
    ];
    const categorizedTransactions = categorizeSimilarTransactions(transactions);

    expect(categorizedTransactions).toEqual([
      {
        id: '1',
        currency: 'EUR',
        amount: 1000,
        targetAccount: '1234',
        category: 'Groceries'
      },
      {
        id: '2',
        currency: 'EUR',
        amount: 500,
        targetAccount: '5678',
        category: 'Entertainment'
      },
      {
        id: '3',
        currency: 'EUR',
        amount: 1200,
        targetAccount: '1234',
        category: 'Groceries'
      }
    ]);
  });

  it.each([['EUR', 'USD'], ['USD', 'EUR']])(
    'should not categorize an uncategorized transaction with the closest amount to a similar transaction when the currencies are different',
    (currencyCategorized: string, currencyUncategorized: string) => {
      const transactions = [
        {
          id: '1',
          currency: currencyCategorized,
          amount: 100,
          targetAccount: '1234',
          category: 'Groceries'
        },
        {
          id: '2',
          currency: 'EUR',
          amount: 50,
          targetAccount: '5678',
          category: 'Entertainment'
        },
        {
          id: '3',
          currency: currencyUncategorized,
          amount: 130,
          targetAccount: '1234'
        },
        {
          id: '4',
          currency: 'EUR',
          amount: 90,
          targetAccount: '5678'
        }
      ];

      const categorizedTransactions = categorizeSimilarTransactions(transactions);

      expect(categorizedTransactions).toEqual([
        {
          id: '1',
          currency: currencyCategorized,
          amount: 100,
          targetAccount: '1234',
          category: 'Groceries'
        },
        {
          id: '2',
          currency: 'EUR',
          amount: 50,
          targetAccount: '5678',
          category: 'Entertainment'
        },
        {
          id: '3',
          currency: currencyUncategorized,
          amount: 130,
          targetAccount: '1234'
        },
        {
          id: '4',
          currency: 'EUR',
          amount: 90,
          targetAccount: '5678',
          category: 'Entertainment'
        }
      ]);
    }
  );
});
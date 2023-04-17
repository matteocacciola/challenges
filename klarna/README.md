# Klarna
This is the Typescript version of the Javascript code I prepared for the code challenge proposed by Klarna during their
selection process.

## Test 1: Balance by category
Calculate the balance in each requested category within the specified time period.

```javascript
getBalanceByCategoryInPeriod(transactions, categories, startTime, endTime)
```

We are expecting production-ready code and tests, so take your time and do your best!
If you have any notes that are not code comments, you can put them in the Your Notes section.
Input

You can assume that the transactions parameter will always be present and valid.

    list of transactions (Transaction[]): All transactions are guaranteed to have the same currency.
    list of categories (String[])
    start time (inclusive) (Date)
    end time (exclusive) (Date)

Output

    Object of category as key and balance as value (Object: { category: balance })

### Transaction data model

Negative transaction amount means money spent. Positive transaction amount means income.
Amount is represented using the smallest currency unit.
A transaction with amount of -350 and currency 'EUR' means an expense of three euros and fifty cents.

This is what a transaction looks like:

```javascript
transaction = {
    id: 'bfd6a11a-2099-4b69-a7bb-572d8436cf73',
    sourceAccount: 'my_account',
    targetAccount: 'coffee_shop',
    amount: -350,
    currency: 'EUR',
    category: 'eating_out',
    time: '2021-03-12T12:34:00Z'
}
```

### Example test
Input

```javascript
getBalanceByCategoryInPeriod([
  {
    id: '11ff73b5-e771-441c-886a-498d93b5093d',
    sourceAccount: 'my_account',
    targetAccount: 'book_store',
    amount: -9600,
    currency: 'EUR',
    category: 'entertainment',
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
  }],
  ['sports'],
  new Date('2021-04-01'),
  new Date('2021-04-30')
);
```

## Categorize similar transactions
Given a list of transactions, some transactions are categorized, some transactions are not categorized. Find similar
transactions and categorize them if possible. Similar transactions have the same targetAccount and the amount difference
is not greater than 1000 (for all currencies) from the originally categorized transaction. If an uncategorized
transaction is similar to more than one transaction, it should take the category from the one with the smallest amount
difference. Transactions that cannot be categorized should still be included in the returned list. The returned list
should preserve the order of the original list.

```javascript
categorizeSimilarTransactions(transactions)
```

We are expecting production-ready code and tests, so take your time and do your best!

If you have any notes, you can put them in the Candidate Notes (instead of polluting your nice code with comments).
Input

You can assume that the transactions parameter will always be present and valid.

    list of transactions (Transaction[])

Output

    List of transactions(Transaction[]) with enhanced categorization if possible.

### Transaction data model

Negative transaction amount means money spent. Positive transaction amount means income.<br/>
Amount is represented using the smallest currency unit.<br/>
A transaction with amount of -350 and currency 'EUR' means an expense of three euros and fifty cents.

This is what a categorized transaction looks like:
```javascript
transaction = {
  id: 'bfd6a11a-2099-4b69-a7bb-572d8436cf73',
  sourceAccount: 'my_account',
  targetAccount: 'coffee_shop',
  amount: -350,
  currency: 'EUR',
  category: 'eating_out',
  time: '2021-03-12T12:34:00Z'
}
```
An uncategorized transaction does not have category property. This is what an uncategorized transaction looks like:
```javascript
transaction = {
  id: '0f0ffbf9-2e26-4f5a-a6c0-fcbd504002f8',
  sourceAccount: 'my_account',
  targetAccount: 'eating_out',
  amount: -1900,
  currency: 'EUR',
  time: '2021-03-12T12:34:00Z'
}
```
The following two transactions are similar:
```javascript
transaction = {
  id: 'bfd6a11a-2099-4b69-a7bb-572d8436cf73',
  sourceAccount: 'my_account',
  targetAccount: 'coffee_shop',
  amount: -350,
  currency: 'EUR',
  category: 'eating_out',
  time: '2021-03-12T12:34:00Z'
}
```
and
```javascript
transaction = {
  id: 'a001bb66-6f4c-48bf-8ae0-f73453aa8dd5',
  sourceAccount: 'my_account',
  targetAccount: 'coffee_shop',
  amount: -620,
  currency: 'EUR',
  time: '2021-04-10T10:30:00Z'
}
```
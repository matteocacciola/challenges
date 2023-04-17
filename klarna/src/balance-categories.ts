export type Transaction = {
  id: string;
  sourceAccount: string;
  targetAccount: string;
  amount: number;
  currency: string;
  category: string;
  time: string;
};

export type Balances = { [x: string]: number };

const initBalances = (categories: string[]): Balances => {
  const balances: Balances = {};
  for (const category of categories) {
    balances[category] = 0;
  }

  return balances;
}

export const getBalanceByCategoryInPeriod = (
  transactions: Transaction[],
  categories: string[],
  start: Date,
  end: Date
): Balances => {
  if (!categories.length) {
    return {};
  }

  const now = new Date();
  if (now < start) {
    return {};
  }

  const balances = initBalances(categories);
  for (const { time, category, amount } of transactions) {
    const timeDate = new Date(time);
    if (timeDate >= start && timeDate < end && categories.includes(category)) {
      balances[category] += amount;
    }
  }
  return balances;
};
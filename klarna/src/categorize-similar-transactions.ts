export type Transaction = {
  id: string;
  sourceAccount?: string;
  targetAccount: string;
  amount: number;
  currency?: string;
  category?: string;
  time?: string;
};

type CategorizedTransactions = { [x: string]: Transaction[] };
type ParsedTransactions = { [x: string]: Transaction };

type SplitTransactionResult = {
  categorized: CategorizedTransactions;
  uncategorized: Transaction[];
  parsed: ParsedTransactions;
};

const splitTransactions = (transactions: Transaction[]): SplitTransactionResult => {
  const categorized: CategorizedTransactions = {};
  const uncategorized: Transaction[] = [];
  const parsed: ParsedTransactions = {};

  for (const transaction of transactions) {
    const { id, currency, targetAccount, category } = transaction;
    parsed[id] = transaction;
    if (!category) {
      uncategorized.push(transaction);
      continue;
    }
    const key = `${currency}:${targetAccount}`;
    categorized[key] = categorized[key] ?? [];
    categorized[key].push(transaction);
  }

  return { categorized, uncategorized, parsed };
}

export const categorizeSimilarTransactions = (transactions: Transaction[]): Transaction[] => {
  const { categorized, uncategorized, parsed } = splitTransactions(transactions);

  for (const { id, currency, amount, targetAccount } of uncategorized) {
    const categorizedCandidates = categorized[`${currency}:${targetAccount}`];
    if (!categorizedCandidates) continue;

    let minDiff = Infinity;
    let closestTransaction = null;

    for (const categorizedCandidate of categorizedCandidates) {
      const diff = Math.abs(categorizedCandidate.amount - amount);
      if (diff <= 1000 && diff < minDiff) {
        minDiff = diff;
        closestTransaction = categorizedCandidate;
      }
    }

    if (closestTransaction) {
      parsed[id].category = closestTransaction.category;
    }
  }

  return Object.values(parsed);
};
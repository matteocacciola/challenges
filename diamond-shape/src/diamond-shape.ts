export const diamondShape = (n: number): string | null => {
  if (n % 2 === 0 || n < 0) {
    return null;
  }

  let diamond = '';
  const middleIndex = Math.floor(n / 2);

  for (let i = 0; i < n; i++) {
    const spaces = Math.abs(middleIndex - i);
    const asterisks = n - 2 * spaces;

    diamond += ' '.repeat(spaces) + '*'.repeat(asterisks) + "\n";
  }

  return diamond;
}

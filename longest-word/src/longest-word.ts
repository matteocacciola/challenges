export const longestWord = (input: string): string => {
  const words = input.split(/[^a-zA-Z0-9]+/);
  let longestWord = '';
  for (const word of words) {
    if (word.length > longestWord.length) {
      longestWord = word;
    }
  }
  return longestWord;
}

export const countVowels = (str: string): number => {
  const regex = new RegExp('[aeiou]', 'gi');
  const matches = str.match(regex);
  return matches ? matches.length : 0;
};

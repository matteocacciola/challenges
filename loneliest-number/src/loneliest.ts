export const loneliestNumber = (input: number) => {
  const digits = input.toString().split('').map((d) => +d);
  const len = digits.length;
  const scores = new Array(len);

  digits.forEach(function (d, i) {
    let sum = 0;
    for (let j = Math.max(0, i - d); j < Math.min(i + d + 1, len); j++) {
      if (j !== i) sum += digits[j];
      scores[i] = sum;
    }
  });

  const minScore = Math.min(...scores);
  const iMinScore = scores.map((s, i) => {
    if (s === minScore) return i;
  });
  const minDigits = digits.filter((d, i) => iMinScore.includes(i));
  return Math.min(...minDigits);
};

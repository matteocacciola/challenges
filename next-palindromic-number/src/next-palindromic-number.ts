const prepare = (num: number) => {
  let digits = [];
  let temp = num;
  while (temp > 0) {
    digits.unshift(temp % 10);
    temp = Math.trunc(temp / 10);
  }

  return digits;
}

const processDigit = (digits: number[], i: number, carriage: number) => {
  const digitsLength = digits.length;

  const firstHalfElement = digits[i];
  const secondHalfElement = digits[digitsLength - 1 - i] + carriage;
  let halfElement = Math.floor(digitsLength / 2);
  if (firstHalfElement === 10) {
    digits[digitsLength - 1 - i] = 0;
    return { digits, carriage: 1 };
  }
  const digit = (i < halfElement) ? firstHalfElement : secondHalfElement;
  carriage = Number(secondHalfElement > digit);
  digits[i] = digits[digitsLength - 1 - i] = digit;

  return { digits, carriage };
}

export const nextPalindrome = (input: number): number => {
  let digits = prepare(input);
  let carriage = 0;
  const digitsLength = digits.length;

  for (let i = 0; i < digitsLength; i++) {
    const r = processDigit(digits, i, carriage);
    digits = r.digits;
    carriage = r.carriage;
  }

  return digits.reduce((acc, next) => 10 * acc + next, 0);
}

const operations = {
  '+': (operand1, operand2) => operand1 + operand2,
  '-': (operand1, operand2) => operand1 - operand2,
  '*': (operand1, operand2) => operand1 * operand2,
  '/': (operand1, operand2) => operand1 / operand2
};

const isNumeric = (expression) => /^-?\d+$/.test(expression);

const operation = (operator, operand1, operand2) => {
  if (!/[+\-*/]/.test(operator)) {
    throw new Error('Something went wrong: operator not recognized');
  }
  return operations[operator](operand1, operand2);
}

exports.calculate = function(expression) {
  // Replace all whitespace characters with a single space
  expression = expression.replace(/\s+/g, ' ').trim();

  // Regular expression to match operators and operands
  const pattern1 = /([+\-*/])\s*(-?\d+\.?\d*)\s*(-?\d+\.?\d*)/g;
  const pattern2 = /(\(?)(-?\d+\.?\d*)(\)?)/g;

  // Iterate until there are no more matches
  while (!isNumeric(expression) && pattern1.test(expression)) {
    // Replace the matches with the calculated results
    expression = expression
      .replace(
        pattern1,
        (match, operator, operand1, operand2) => operation(operator, parseFloat(operand1), parseFloat(operand2))
      )
      .replace(pattern2, (match, open, digit, close) => digit);
  }

  // The final result is the only remaining number in the expression
  return parseFloat(expression);
}

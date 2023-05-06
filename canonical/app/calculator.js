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
  const pattern = /([+\-*/])\s*(-?\d+\.?\d*)\s*(-?\d+\.?\d*)/;

  // Iterate until there are no more matches
  while (!isNumeric(expression) && pattern.test(expression)) {
    // Replace the first match with the calculated result
    expression = expression.replace(pattern, (match, operator, operand1, operand2) =>
        operation(operator, parseFloat(operand1), parseFloat(operand2))
    );
  }

  // The final result is the only remaining number in the expression
  return parseFloat(expression);
}

const operations = {
  '+': (operand1, operand2) => operand1 + operand2,
  '-': (operand1, operand2) => operand1 - operand2,
  '*': (operand1, operand2) => operand1 * operand2,
  '/': (operand1, operand2) => operand1 / operand2,
};

const tokenizer = (expression) => {
  return expression
    .match(/\(|\)|\d+(\.\d+)?|\w+|[+\-*/]/g)
    .map((token) => (/^\d/.test(token) ? parseFloat(token) : token));
}

const isOperand = (el) => /^-?\d+(\.\d+)?$/.test(el);
const isOperator = (el) => /^[+\-*/]$/.test(el);

exports.calculate = function(expression) {
  const tokens = tokenizer(expression);
  let stack = [], token;

  for (let l = tokens.length, i = l - 1; i >= 0; i--) {
    token = tokens[i];
    const isTokenOperand = isOperand(token), isTokenOperator = isOperator(token);
    if (isTokenOperand === true || isTokenOperator === true) {
      stack.unshift(
        isTokenOperand ? token : operations[token](stack.shift(), stack.shift())
      );
    }
  }

  return stack.shift();
}
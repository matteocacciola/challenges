var assert = require('assert');
var calculator = require('../app/calculator');

describe('Calculator', function() {
  it('returns zero', function() {
    let result = calculator.calculate('0');
    return assert.equal(result, 0);
  });

  it('should calculate addition', function() {
    let result = calculator.calculate('+ 3 4');
    return assert.equal(result, 3 + 4);
  });

  it ('should calculate division', function () {
    let result = calculator.calculate('/ 2.5 2');
    assert.equal(result, 2.5 / 2);
  });

  it('should calculate subtraction and multiplication', function() {
    let result = calculator.calculate('- 3 * 4 5');
    return assert.equal(result, 3 - (4 * 5));
  });

  it('should calculate addition and multiplication', function() {
    let result = calculator.calculate('* + 3 4 5');
    return assert.equal(result, (3 + 4) * 5);
  });

  it('should calculate subtraction and division', function() {
    let result = calculator.calculate('- 3 / 4 5');
    return assert.equal(result, 3 - (4 / 5));
  });

  it('should calculate addition and division', function() {
    let result = calculator.calculate('/ + 3 4 5');
    return assert.equal(result, (3 + 4) / 5);
  });

  it ('should calculate complex nesting', function () {
    let result = calculator.calculate('* (+ 2 3) (- 10 6)');
    assert.equal(result, (2 + 3) * (10 - 6));

    result = calculator.calculate('+ 1 (/ 2 (+ 3 (* 4 5)))');
    return assert.equal(result, 1 + (2 / (3 + (4 * 5))));
  });

  it ('should accept decimals and integers', function () {
    let result = calculator.calculate('+ 2.5 2');
    assert.equal(result, 2.5 + 2);

    result = calculator.calculate('+ 5.4443 2');
    assert.equal(result, 5.4443 + 2);

    result = calculator.calculate('* 2.5 2');
    return assert.equal(result, 2.5 * 2);
  });
})


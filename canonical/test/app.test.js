var assert = require('assert');
var calculator_v1 = require('../app/v1/calculator');
var calculator_v2 = require('../app/v2/calculator');

describe('Calculator v1', function() {
  it('returns zero', function() {
    let result = calculator_v1.calculate('0');
    return assert.equal(result, 0);
  });

  it('should calculate addition', function() {
    let result = calculator_v1.calculate('+ 3 4');
    return assert.equal(result, 3 + 4);
  });

  it ('should calculate division', function () {
    let result = calculator_v1.calculate('/ 2.5 2');
    assert.equal(result, 2.5 / 2);
  });

  it('should calculate subtraction and multiplication', function() {
    let result = calculator_v1.calculate('- 3 * 4 5');
    return assert.equal(result, 3 - (4 * 5));
  });

  it('should calculate addition and multiplication', function() {
    let result = calculator_v1.calculate('* + 3 4 5');
    return assert.equal(result, (3 + 4) * 5);
  });

  it('should calculate subtraction and division', function() {
    let result = calculator_v1.calculate('- 3 / 4 5');
    return assert.equal(result, 3 - (4 / 5));
  });

  it('should calculate addition and division', function() {
    let result = calculator_v1.calculate('/ + 3 4 5');
    return assert.equal(result, (3 + 4) / 5);
  });

  it ('should calculate complex nesting', function () {
    let result = calculator_v1.calculate('* (+ 2 3) (- 10 6)');
    assert.equal(result, (2 + 3) * (10 - 6));

    result = calculator_v1.calculate('+ 1 (/ 2 (+ 3 (* 4 5)))');
    return assert.equal(result, 1 + (2 / (3 + (4 * 5))));
  });

  it ('should accept decimals and integers', function () {
    let result = calculator_v1.calculate('+ 2.5 2');
    assert.equal(result, 2.5 + 2);

    result = calculator_v1.calculate('+ 5.4443 2');
    assert.equal(result, 5.4443 + 2);

    result = calculator_v1.calculate('* 2.5 2');
    return assert.equal(result, 2.5 * 2);
  });
})

describe('Calculator v2', function() {
  it('returns zero', function() {
    let result = calculator_v2.calculate('0');
    return assert.equal(result, 0);
  });

  it('should calculate addition', function() {
    let result = calculator_v2.calculate('+ 3 4');
    return assert.equal(result, 3 + 4);
  });

  it ('should calculate division', function () {
    let result = calculator_v2.calculate('/ 2.5 2');
    assert.equal(result, 2.5 / 2);
  });

  it('should calculate subtraction and multiplication', function() {
    let result = calculator_v2.calculate('- 3 * 4 5');
    return assert.equal(result, 3 - (4 * 5));
  });

  it('should calculate addition and multiplication', function() {
    let result = calculator_v2.calculate('* + 3 4 5');
    return assert.equal(result, (3 + 4) * 5);
  });

  it('should calculate subtraction and division', function() {
    let result = calculator_v2.calculate('- 3 / 4 5');
    return assert.equal(result, 3 - (4 / 5));
  });

  it('should calculate addition and division', function() {
    let result = calculator_v2.calculate('/ + 3 4 5');
    return assert.equal(result, (3 + 4) / 5);
  });

  it ('should calculate complex nesting', function () {
    let result = calculator_v2.calculate('* (+ 2 3) (- 10 6)');
    assert.equal(result, (2 + 3) * (10 - 6));

    result = calculator_v2.calculate('+ 1 (/ 2 (+ 3 (* 4 5)))');
    return assert.equal(result, 1 + (2 / (3 + (4 * 5))));
  });

  it ('should accept decimals and integers', function () {
    let result = calculator_v2.calculate('+ 2.5 2');
    assert.equal(result, 2.5 + 2);

    result = calculator_v2.calculate('+ 5.4443 2');
    assert.equal(result, 5.4443 + 2);

    result = calculator_v2.calculate('* 2.5 2');
    return assert.equal(result, 2.5 * 2);
  });
})

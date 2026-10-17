import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluate,
  expressionForEquals,
  expressionForNextOperator,
  formatResult,
} from "./calculator.ts";

test("evaluates chained expressions with normal operator precedence", () => {
  assert.equal(evaluate("2+5+78-8*54"), -347);
});

test("evaluates the current expression when another operator is pressed", () => {
  const next = expressionForNextOperator("1+2", "*");
  assert.equal(next, "3*");
  assert.equal(evaluate(`${next}4`), 12);
});

test("repeats the displayed number when equals follows an operator", () => {
  const expression = expressionForEquals("5+", "5");
  assert.equal(evaluate(expression), 10);
});

test("rounds fractional results to the 10 digit display limit", () => {
  assert.equal(formatResult(2 / 3), "0.666666667");
  assert.equal(formatResult(-2 / 3), "-0.666666667");
});

test("accepts a 10 digit result but rejects a larger result", () => {
  assert.equal(formatResult(9_999_999_999), "9999999999");
  assert.throws(() => formatResult(10_000_000_000), /10 digits/);
  assert.throws(() => formatResult(9_999_999_999.9), /10 digits/);
});

test("rejects division by zero", () => {
  assert.throws(() => evaluate("2/0"), /Division by zero/);
});

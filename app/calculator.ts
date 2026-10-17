export function evaluate(expression: string): number {
  const tokens = expression.match(/\d+(?:\.\d*)?|\.\d+|[+\-*/]/g) ?? [];
  if (!tokens.length || tokens.join("") !== expression) throw new Error("Invalid expression");
  let i = 0;
  const factor = (): number => {
    if (tokens[i] === "+" || tokens[i] === "-") return (tokens[i++] === "-" ? -1 : 1) * factor();
    const token = tokens[i++];
    if (token === undefined || Number.isNaN(Number(token))) throw new Error("Expected number");
    return Number(token);
  };
  const term = (): number => {
    let n = factor();
    while (tokens[i] === "*" || tokens[i] === "/") {
      const op = tokens[i++];
      const next = factor();
      if (op === "/" && next === 0) throw new Error("Division by zero");
      n = op === "*" ? n * next : n / next;
    }
    return n;
  };
  let n = term();
  while (tokens[i] === "+" || tokens[i] === "-") {
    const op = tokens[i++];
    const next = term();
    n = op === "+" ? n + next : n - next;
  }
  if (i !== tokens.length) throw new Error("Invalid expression");
  return n;
}

export function formatResult(result: number): string {
  if (!Number.isFinite(result)) throw new Error("Invalid result");
  const integerDigits = String(Math.floor(Math.abs(result))).length;
  if (integerDigits > 10) throw new Error("Result exceeds 10 digits");

  const rounded = Number(result.toFixed(Math.max(0, 10 - integerDigits)));
  if (String(Math.floor(Math.abs(rounded))).length > 10) throw new Error("Result exceeds 10 digits");
  return String(rounded);
}

export function expressionForEquals(expression: string, displayedNumber: string): string {
  return /[+\-*/]$/.test(expression) ? expression + displayedNumber : expression;
}

export function expressionForNextOperator(expression: string, operator: string): string {
  if (/[+\-*/]$/.test(expression)) return expression.slice(0, -1) + operator;
  return `${formatResult(evaluate(expression))}${operator}`;
}

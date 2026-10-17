"use client";

import { useState } from "react";
import "./globals.css";
import { evaluate, expressionForEquals, expressionForNextOperator, formatResult } from "./calculator";

const buttons = [
  "AC", "DEL", "+/-", "/", "7", "8", "9", "*", "4", "5", "6", "-",
  "1", "2", "3", "+", "0", ".", "=",
];

export default function Home() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("0");
  const [finished, setFinished] = useState(false);
  const digitCount = (text: string) => text.match(/\d/g)?.length ?? 0;

  const handleClick = (key: string) => {
    if (key === "AC") {
      setDisplay("0");
      setExpression("0");
      setFinished(false);
    } else if (key === "DEL") {
      if (/[+\-*/]$/.test(expression)) {
        const nextExpression = expression.slice(0, -1) || "0";
        setExpression(nextExpression);
        setDisplay(nextExpression.match(/-?\d*\.?\d+$/)?.[0] ?? "0");
      } else {
        const nextDisplay = display.length > 1 ? display.slice(0, -1) : "0";
        setDisplay(nextDisplay);
        setExpression(expression.length > 1 ? expression.slice(0, -1) : "0");
      }
      setFinished(false);
    } else if (display === "Error") {
      if (/^\d$/.test(key)) {
        setDisplay(key);
        setExpression(key);
      }
      setFinished(false);
    } else if (key === "=") {
      try {
        const expressionToEvaluate = expressionForEquals(expression, display);
        const resultText = formatResult(evaluate(expressionToEvaluate));
        setDisplay(resultText);
        setExpression(resultText);
      } catch {
        setDisplay("Error");
        setExpression("Error");
      }
      setFinished(true);
    } else if (key === "+/-") {
      if (Number(display) === 0) return;
      const match = display.match(/(-?\d*\.?\d*)$/);
      const part = match?.[0] ?? "";
      const start = display.length - part.length;
      const nextDisplay = display.slice(0, start) + (part.startsWith("-") ? part.slice(1) : `-${part || "0"}`);
      setDisplay(nextDisplay);
      setExpression(expression.slice(0, expression.length - display.length) + nextDisplay);
      setFinished(false);
    } else if (["+", "-", "*", "/"].includes(key)) {
      if (/[+\-*/]/.test(expression) && !/[+\-*/]$/.test(expression) && !finished) {
        try {
          const nextExpression = expressionForNextOperator(expression, key);
          const resultText = nextExpression.slice(0, -1);
          setDisplay(resultText);
          setExpression(nextExpression);
        } catch {
          setDisplay("Error");
          setExpression("Error");
          setFinished(true);
          return;
        }
      } else {
        setExpression(expressionForNextOperator(expression, key));
      }
      setFinished(false);
    } else if (key === ".") {
      const startsNewNumber = /[+\-*/]$/.test(expression);
      if (startsNewNumber || !display.includes(".")) {
        const addition = startsNewNumber ? "0." : ".";
        const nextDisplay = startsNewNumber || display === "0" ? "0." : display + addition;
        setDisplay(nextDisplay);
        setExpression(expression + addition);
      }
      setFinished(false);
    } else if (/^[0-9]$/.test(key) && (finished || /[+\-*/]$/.test(expression) || digitCount(display) < 10)) {
      const startsNewNumber = /[+\-*/]$/.test(expression);
      const nextDisplay = finished || startsNewNumber || display === "0" ? key : display + key;
      const nextExpression = finished ? key : expression === "0" ? key : expression + key;
      setDisplay(nextDisplay);
      setExpression(nextExpression);
      setFinished(false);
    }
  };

  return (
    <main className="page">
      <div className="calculator">
        <h1>Calculator</h1>
        <div className="display" aria-live="polite" title={display}>
          {display}
        </div>
        <div className="buttons">
          {buttons.map((key) => (
            <button key={key} type="button" onClick={() => handleClick(key)} className={["button", ["+", "-", "*", "/", "="].includes(key) ? "operator" : "", ["AC", "DEL"].includes(key) ? "special" : "", key === "0" ? "zero" : ""].join(" ")}>
              {key === "*" ? "×" : key === "/" ? "÷" : key}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

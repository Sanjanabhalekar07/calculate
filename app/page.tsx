
"use client";

import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(false);

  const handleClick = (value: string) => {
    if (value === "AC") {
      setDisplay("0");
      setFirstNumber(null);
      setOperator(null);
      setNewNumber(false);
      return;
    }

    if (value === "DEL") {
      if (newNumber || display === "Error") {
        setDisplay("0");
        setNewNumber(false);
      } else {
        setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
      }
      return;
    }

    if (value === "+/-") {
      if (display !== "Error" && Number(display) !== 0) {
        setDisplay(display.startsWith("-") ? display.slice(1) : `-${display}`);
      }
      return;
    }

    if (["+", "-", "*", "/"].includes(value)) {
      if (display === "Error") return;

      setFirstNumber(Number(display));
      setOperator(value);
      setNewNumber(true);
      return;
    }

    if (value === "=") {
      if (firstNumber === null || operator === null) return;

      const secondNumber = Number(display);
      let result: number;

      switch (operator) {
        case "+":
          result = firstNumber + secondNumber;
          break;
        case "-":
          result = firstNumber - secondNumber;
          break;
        case "*":
          result = firstNumber * secondNumber;
          break;
        case "/":
          if (secondNumber === 0) {
            setDisplay("Error");
            setFirstNumber(null);
            setOperator(null);
            setNewNumber(true);
            return;
          }
          result = firstNumber / secondNumber;
          break;
        default:
          return;
      }

      setDisplay(
        Number.isFinite(result)
          ? String(Number(result.toPrecision(10)))
          : "Error"
      );

      setFirstNumber(null);
      setOperator(null);
      setNewNumber(true);
      return;
    }

    if (value === ".") {
      if (newNumber || display === "Error") {
        setDisplay("0.");
        setNewNumber(false);
      } else if (!display.includes(".")) {
        setDisplay(display + ".");
      }
      return;
    }

    if (newNumber || display === "0" || display === "Error") {
      setDisplay(value);
      setNewNumber(false);
    } else {
      setDisplay(display + value);
    }
  };

  const buttons = [
    "AC", "DEL", "+/-", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "=",
  ];

  return (
    <main className="page">
      <div className="calculator">
        <h1>Calculator</h1>

        <div className="display" aria-live="polite">
          {display}
        </div>

        <div className="buttons">
          {buttons.map((button) => (
            <button
              key={button}
              type="button"
              onClick={() => handleClick(button)}
              className={[
                "button",
                ["+", "-", "*", "/", "="].includes(button)
                  ? "operator"
                  : "",
                ["AC", "DEL"].includes(button) ? "special" : "",
                button === "0" ? "zero" : "",
              ].join(" ")}
            >
              {button === "*" ? "×" : button === "/" ? "÷" : button}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

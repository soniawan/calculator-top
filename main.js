// function basic math
function add(firstNum, secondNum) {
  return firstNum + secondNum;
}

function subtract(firstNum, secondNum) {
  return firstNum - secondNum;
}

function multiply(firstNum, secondNum) {
  return firstNum * secondNum;
}

function divide(firstNum, secondNum) {
  if (secondNum === 0) {
    return `Error: cannot / 0`;
  }

  return firstNum / secondNum;
}

function operate(operator, firstNum, secondNum) {
  switch (operator) {
    case "+":
      return add(firstNum, secondNum);
    case "-":
      return subtract(firstNum, secondNum);
    case "*":
      return multiply(firstNum, secondNum);
    case "/":
      return divide(firstNum, secondNum);
    default:
      return "Error";
  }
}

// Display
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let displayValue = "0";
let resultDisplayed = false;

const screenEl = document.querySelector("#screen");
const historyEl = document.querySelector("#history");
const keysEl = document.querySelector("#keys");

function updateDisplay() {
  screenEl.textContent = displayValue;
}
updateDisplay();

// Helper for format result
function formatResult(num) {
  if (typeof num !== "number" || !isFinite(num)) return String(num);

  const s = Number(num.toPrecision(12).toString());
  return s;
}

function setHistory(text) {
  historyEl.textContent = text || "\u00A0";
}

// click digit and update display
function inputDigit(d) {
  if (resultDisplayed) {
    displayValue = "0";
    resultDisplayed = false;
    setHistory("");
  }
  if (displayValue === "0") {
    displayValue = d;
  } else {
    displayValue += d;
  }
  updateDisplay();
}

function inputDecimal() {
  if (resultDisplayed) {
    displayValue = "0";
    resultDisplayed = false;
    setHistory("");
  }
  if (!displayValue.includes(".")) {
    displayValue += ".";
    updateDisplay();
  }
}

// choose operator
function chooseOperator(op) {
  if (
    currentOperator &&
    !resultDisplayed &&
    firstOperand !== null &&
    secondOperand === null
  ) {
    currentOperator = op;
    setHistory(`${firstOperand} ${op}`);
    return;
  }

  if (firstOperand === null) {
    firstOperand = Number(displayValue);
    currentOperator = op;
    setHistory(`${firstOperand} ${op}`);
    displayValue = "0";
    updateDisplay();
    return;
  }

  secondOperand = Number(displayValue);
  const raw = operate(currentOperator, firstOperand, secondOperand);
  if (typeof raw === "string") {
    displayValue = raw;
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    resultDisplayed = true;
    setHistory("");
    updateDisplay();
    return;
  }

  const result = formatResult(raw);
  displayValue = result;
  updateDisplay();

  firstOperand = Number(result);
  secondOperand = null;
  currentOperator = op;
  setHistory(`${firstOperand} ${op}`);
  resultDisplayed = false;
}

// evaluate
function evaluateEquals() {
  if (currentOperator === null) return;
  if (resultDisplayed) return;

  secondOperand = Number(displayValue);
  const raw = operate(currentOperator, firstOperand, secondOperand);
  if (typeof raw === "string") {
    displayValue = raw;
    updateDisplay();
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    setHistory("");
    resultDisplayed = true;
    return;
  }

  const result = formatResult(raw);
  setHistory(`${firstOperand} ${currentOperator} ${secondOperand} =`);
  displayValue = result;
  updateDisplay();
  firstOperand = Number(result);
  secondOperand = null;
  currentOperator = null;
  resultDisplayed = true;
}

// clear screen & backspace
function doClear() {
  firstOperand = null;
  secondOperand = null;
  currentOperator = null;
  displayValue = "0";
  resultDisplayed = false;
  setHistory("");
  updateDisplay();
}

function doBackspace() {
  if (resultDisplayed) return;
  if (displayValue.length <= 1) displayValue = "0";
  else displayValue = displayValue.slice(0, -1);
  updateDisplay();
}

// add event listener button
keysEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const val = btn.dataset.value;

  switch (action) {
    case "digit":
      inputDigit(val);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      chooseOperator(val);
      break;
    case "equals":
      evaluateEquals(val);
      break;
    case "clear":
      doClear();
      break;
    case "backspace":
      doBackspace();
      break;
  }
});

// keyboard support
window.addEventListener("keydown", (e) => {
  if (e.key > "0" && e.key <= "9") {
    inputDigit(e.key);
    return;
  }
  if (e.key === ".") {
    inputDecimal();
    return;
  }
  if (["+", "-", "*", "/"].includes(e.key)) {
    chooseOperator(e.key);
    return;
  }
  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    evaluateEquals();
    return;
  }
  if (e.key === "Backspace") {
    doBackspace();
    return;
  }
  if (e.key.toLowerCase() === "c") {
    doClear();
    return;
  }
});

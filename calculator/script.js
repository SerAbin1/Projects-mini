let operand1 = '';
let operator;
let operand2 = '';
let res;

const display = document.querySelector('.display');
const result = document.querySelector('.result');

const calculator = document.querySelector('.Calculator');
calculator.addEventListener('click', operate);

function operate(e) {
    const buttonText = e.target.textContent;
    if (!isNaN(buttonText) || buttonText === '.') {
        operand1 += buttonText;
        display.textContent += operand1;
    } else if (buttonText === '+' || buttonText === '-' || buttonText === 'x' || buttonText === '/') {
        operator = buttonText === 'x' ? '*' : buttonText;
        display.textContent += operator;
        operand2 = operand1;
        operand1 = '';
    } else if (buttonText === '=') {
        const num1 = Number(operand2);
        const num2 = Number(operand1);
        switch(operator){
            case '+':
                res = add(num1, num2);
                break;
            case '*':
                res = multiply(num1, num2);
                break;
            case '-':
                res = subtract(num1, num2);
                break;
            case '/':
                res = divide(num1, num2);
                break;
        }
        result.textContent = res;
        operand1 = res;
        operand2 = '';
        operator = '';
    } else if (buttonText === 'AC'){
        display.textContent = '';
        result.textContent = '';
        operand1 = '';
        operand2 = '';
        operator = '';
    }
}

function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

function subtract(a, b) {  
    return a - b;
}

function divide(a, b) {
    return a / b;
}

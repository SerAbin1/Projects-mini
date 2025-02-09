let operand1;
let operator;
let operand2;
let res;

const display = document.querySelector('.display');


const calculator = document.querySelector('.Calculator');
calculator.addEventListener('click', operate);

function operate(e) {
    const buttonText = e.target.textContent;
    operand1 += buttonText;
    if (buttonText === '+' || buttonText === '-' || buttonText === '*' || buttonText === '/') {
        operator = buttonText;
        operand1 = operand1.slice(0, -1);
        operand2 = operand1;
        operand1 = '';
    }
    if (buttonText === '=') {
        switch(operator){
            case '+':
                res = add(operand2, operand1);
                display.textContent = res;
                break;
            case '*':
                multiply(operand2, operand1);
                break;
            case '-':
                subtract(operand2, operand1);
                break;
            case '/':
                divide(operand2, operand1);
                break;
        }
    }
    if (buttonText === 'AC'){
        display.textContent = '';
            operand1 = '';
            operand2 = '';
            operator = '';
    }
}

function add(a, b) {

    return Number(a) + Number(b);
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

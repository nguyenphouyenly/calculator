// Lấy các phần tử DOM cần thiết
const display = document.getElementById('display');
const keys = document.querySelector('.calculator-keys');

// Đối tượng lưu trữ trạng thái hiện tại của máy tính
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// Hàm cập nhật con số lên màn hình
function updateDisplay() {
    let displayString = String(calculator.displayValue);
   
    if (displayString.includes('Infinity')) {
        display.textContent = 'Lỗi: Vô cực';
    } else if (displayString === 'NaN') {
        display.textContent = 'Lỗi: Không phải số';
    } else {
        display.textContent = displayString.length > 18
            ? parseFloat(displayString).toPrecision(15)
            : displayString;
    }
}

// Hàm xử lý khi bấm phím số (0-9)
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }

    updateDisplay();
}

// Hàm xử lý khi bấm dấu thập phân (.)
function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }

    updateDisplay();
}

// Hàm xử lý khi bấm phép toán (+, -, x, /, ^, %)
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (!Number.isFinite(inputValue) && inputValue !== 0) {
        calculator.displayValue = 'Lỗi phép toán';
        updateDisplay();
        return;
    }

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
   
    updateDisplay();
}

// Đối tượng định nghĩa công thức tính (khớp với data-action trong HTML)
const performCalculation = {
    'divide': (firstOperand, secondOperand) => firstOperand / secondOperand,
    'multiply': (firstOperand, secondOperand) => firstOperand * secondOperand,
    'add': (firstOperand, secondOperand) => firstOperand + secondOperand,
    'subtract': (firstOperand, secondOperand) => firstOperand - secondOperand,
    'exponentiation': (firstOperand, secondOperand) => firstOperand ** secondOperand,
    'modulo': (firstOperand, secondOperand) => firstOperand % secondOperand,
};

// Hàm xóa toàn bộ (nút AC)
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateDisplay();
}

// Lắng nghe sự kiện click chuột trên bàn phím máy tính
keys.addEventListener('click', (event) => {
    const { target } = event;
    const action = target.dataset.action;
    const value = target.dataset.value;

    if (!target.matches('button')) {
        return;
    }

    if (value !== undefined) {
        inputDigit(value);
        return;
    }

    if (action === 'decimal') {
        inputDecimal('.');
        return;
    }

    if (action === 'clear') {
        resetCalculator();
        return;
    }

    if (action) {
        if (action === 'calculate') {
            if (calculator.operator !== null) {
                handleOperator(calculator.operator);
                calculator.waitingForSecondOperand = true;
                calculator.operator = null;
            }
        } else {
            handleOperator(action);
        }
        return;
    }
});

// Hiển thị số 0 ban đầu
updateDisplay();
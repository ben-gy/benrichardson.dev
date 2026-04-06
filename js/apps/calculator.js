// ============ CALCULATOR ============

import { registerWindow, toggleWindow } from '../window-manager.js';
import { closeAllDropdowns } from '../utils.js';

let calcValue = '0';

// Safe math evaluation - replaces eval()
function safeEval(expr) {
    // Tokenize: numbers (including decimals) and operators
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        if (expr[i] === ' ') { i++; continue; }

        // Number (possibly with leading minus for negative after operator)
        if (/[0-9.]/.test(expr[i]) ||
            (expr[i] === '-' && (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'string'))) {
            let num = '';
            if (expr[i] === '-') { num = '-'; i++; }
            while (i < expr.length && /[0-9.]/.test(expr[i])) {
                num += expr[i]; i++;
            }
            const parsed = parseFloat(num);
            if (isNaN(parsed)) throw new Error('Invalid number');
            tokens.push(parsed);
        } else if ('+-*/'.includes(expr[i])) {
            tokens.push(expr[i]);
            i++;
        } else {
            throw new Error('Invalid character: ' + expr[i]);
        }
    }

    if (tokens.length === 0) throw new Error('Empty expression');

    // Evaluate with operator precedence: * / first, then + -
    // First pass: handle * and /
    let values = [tokens[0]];
    let ops = [];
    for (let j = 1; j < tokens.length; j += 2) {
        const op = tokens[j];
        const val = tokens[j + 1];
        if (typeof op !== 'string' || typeof val !== 'number') throw new Error('Invalid expression');

        if (op === '*') {
            values[values.length - 1] *= val;
        } else if (op === '/') {
            if (val === 0) return Infinity;
            values[values.length - 1] /= val;
        } else {
            ops.push(op);
            values.push(val);
        }
    }

    // Second pass: handle + and -
    let result = values[0];
    for (let j = 0; j < ops.length; j++) {
        if (ops[j] === '+') result += values[j + 1];
        else if (ops[j] === '-') result -= values[j + 1];
    }

    return result;
}

function updateCalcDisplay() {
    document.getElementById('calc-display').textContent = calcValue;
}

export function calcInput(val) {
    if (calcValue === '0' && !isNaN(val)) {
        calcValue = val;
    } else {
        calcValue += val;
    }
    updateCalcDisplay();
}

export function calcClear() {
    calcValue = '0';
    updateCalcDisplay();
}

export function calcBackspace() {
    calcValue = calcValue.slice(0, -1) || '0';
    updateCalcDisplay();
}

export function calcEquals() {
    try {
        const result = safeEval(calcValue);
        calcValue = String(result);
        if (calcValue === 'Infinity' || calcValue === 'NaN' || calcValue === 'undefined') {
            calcValue = 'Error';
        }
    } catch (e) {
        calcValue = 'Error';
    }
    updateCalcDisplay();
}

export function toggleCalculator() {
    closeAllDropdowns();
    toggleWindow('calculator-window');
}

export function initCalculator() {
    registerWindow('calculator-window', {
        x: 50, y: 100,
        onOpen: function() {
            calcValue = '0';
            updateCalcDisplay();
        }
    });
}

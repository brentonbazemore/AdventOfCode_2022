"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const inputFile = process.argv[2];
const rawData = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data = rawData.split('\n');
const operations = {
    '*': (a, b) => a * b,
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '/': (a, b) => a / b,
    '=': (a, b) => +(a === b),
};
const getMonkeys = () => {
    const monkeys = {};
    data.forEach(rawMonkey => {
        const [id, rawOperation] = rawMonkey.split(': ');
        const opTokens = rawOperation.split(' ');
        if (id === 'root') {
            opTokens[1] = '=';
        }
        if (opTokens.length === 1) {
            monkeys[id] = {
                type: 'yeller',
                value: +opTokens[0],
            };
        }
        else {
            monkeys[id] = {
                type: 'doer',
                value: null,
                operation: operations[opTokens[1]],
                dep1: opTokens[0],
                dep2: opTokens[2],
            };
        }
    });
    return monkeys;
};
const solve = (humanYell, monkeys, id) => {
    const monkey = monkeys[id];
    if (id === 'humn') {
        return humanYell;
    }
    if (monkey.type === 'yeller') {
        return monkey.value;
    }
    if (monkey.value != null) {
        return monkey.value;
    }
    const dep1 = solve(humanYell, monkeys, monkey.dep1);
    const dep2 = solve(humanYell, monkeys, monkey.dep2);
    monkey.value = monkey.operation(dep1, dep2);
    return monkey.value;
};
const solveFor = (humanYell) => {
    const monkeys = getMonkeys();
    return solve(humanYell, monkeys, 'cmmh');
};
console.time();
const target = 7012559479583;
// 7012559479583
// 7012558569299.059.801.184.402.293.375.598.316.973.777.
for (let i = 0; i < 5; i++) {
    const human = 3665520865940 + i;
    const result = solveFor(human);
    console.log(result, result > target ? 'up' : 'down');
    if (target === result) {
        console.log(human);
        break;
    }
}
console.timeEnd();
//# sourceMappingURL=index.js.map
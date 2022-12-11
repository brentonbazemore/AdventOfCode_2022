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
const data = rawData.split('\n\n');
class Monkey {
    id;
    items = [];
    inspect;
    postInspection = (worryLevel) => {
        this.inspectionCount++;
        return Math.floor(worryLevel / 3);
    };
    test;
    inspectionCount = 0;
    constructor(raw) {
        const lines = raw.split('\n');
        this.id = +lines[0][7];
        this.items = lines[1].split(': ')[1].split(', ').map(Number);
        const [, , one, symbol, two] = lines[2].split(': ')[1].split(' ');
        this.inspect = (worryLevel) => {
            let op1 = +one;
            let op2 = +two;
            if (one === 'old') {
                op1 = worryLevel;
            }
            if (two === 'old') {
                op2 = worryLevel;
            }
            if (symbol === '*') {
                return op1 * op2;
            }
            if (symbol === '+') {
                return op1 + op2;
            }
            throw new Error('invalid');
        };
        const divisor = +lines[3].split('divisible by ')[1];
        const trueDest = +lines[4].split('to monkey ')[1];
        const falseDest = +lines[5].split('to monkey ')[1];
        this.test = (worryLevel) => {
            const isDivisble = worryLevel % divisor === 0;
            if (isDivisble) {
                return trueDest;
            }
            else {
                return falseDest;
            }
        };
    }
    catch(item) {
        this.items.push(item);
    }
    throw() {
        const item = this.items.shift();
        return item;
    }
}
const monkeys = data.map(rawMonkey => {
    return new Monkey(rawMonkey);
});
const rounds = 20;
for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) => {
        while (monkey.items.length > 0) {
            const item = monkey.throw();
            if (item == undefined) {
                break;
            }
            const inspectedItem = monkey.inspect(item);
            const postInspectedItem = monkey.postInspection(inspectedItem);
            const targetMonkey = monkey.test(postInspectedItem);
            monkeys[targetMonkey].catch(postInspectedItem);
        }
    });
}
const [first, second] = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount).map(m => m.inspectionCount);
console.log(first * second);
//# sourceMappingURL=index.js.map
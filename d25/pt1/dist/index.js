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
const charMap = {
    '0': 0,
    '1': 1,
    '2': 2,
    '-': -1,
    '=': -2,
};
let tot = 0;
data.forEach(rawNum => {
    let sum = 0;
    for (let i = 0; i < rawNum.length; i++) {
        sum += (charMap[rawNum[i]] * (5 ** ((rawNum.length - 1) - i)));
    }
    tot += sum;
});
console.log(tot);
const top = `${Number(tot).toString(5)}`.split('').map(d => '2');
top.push('2'); // just make it a bit bigger
console.log(top.join(''));
const chars = ['2', '1', '0', '-', '='];
let position = -1;
positionLoop: while (true) {
    position++;
    for (let i = 0; i < 5; i++) {
        const candidate = [...top];
        candidate[position] = chars[i];
        console.log(candidate.join(''));
        let sum = 0;
        for (let i = 0; i < candidate.length; i++) {
            sum += (charMap[candidate[i]] * (5 ** ((candidate.length - 1) - i)));
        }
        if (sum < tot) {
            top[position] = chars[i - 1];
            continue positionLoop;
        }
        if (sum === tot) {
            console.log('Result:');
            console.log(candidate.join(''));
            break positionLoop;
        }
        if (i === 4) {
            top[position] = chars[4];
            continue positionLoop;
        }
    }
}
//# sourceMappingURL=index.js.map
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
let register = 1;
const ops = {
    'addx': {
        requiredCycles: 2,
        op: (val) => {
            register += val;
        }
    },
    'noop': {
        requiredCycles: 1,
        op: (val) => { }
    }
};
const instructions = data.map((row) => {
    const [rawInst, rawV] = row.split(' ');
    const inst = rawInst;
    const value = +rawV;
    return { inst, value };
}).reverse();
const rows = ['', '', '', '', '', ''];
const max = 240;
let currentInst = instructions.pop();
let remainingCycles = ops[currentInst.inst].requiredCycles;
for (let i = 0; i < max; i++) {
    let currentRow = Math.floor(i / 40);
    if (remainingCycles === 0) {
        ops[currentInst.inst].op(currentInst.value);
        currentInst = instructions.pop();
        remainingCycles = ops[currentInst.inst].requiredCycles;
    }
    remainingCycles--;
    if ([register - 1, register, register + 1].includes(i % 40)) {
        rows[currentRow] += '#';
    }
    else {
        rows[currentRow] += ' ';
    }
}
console.log(rows);
//# sourceMappingURL=index.js.map
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
const [initial, rawInstructions] = rawData.split('\n\n').map(r => r.split('\n'));
const stacks = {};
for (let i = 0; i < initial.length - 1; i++) {
    const row = initial[i];
    let stackId = 0;
    for (let j = 1; j < row.length; j += 4) {
        stackId++;
        const crate = row[j];
        if (!stacks[stackId]) {
            stacks[stackId] = [];
        }
        if (crate === ' ') {
            continue;
        }
        stacks[stackId].push(crate);
    }
}
Object.values(stacks).map(s => s.reverse());
const instructions = rawInstructions.map(inst => {
    const [, amount, , from, , to] = inst.split(' ').map(Number);
    return { amount, from, to };
});
instructions.forEach(inst => {
    for (let i = 0; i < inst.amount; i++) {
        stacks[inst.to].push(stacks[inst.from].pop());
    }
});
console.log(Object.values(stacks).map(s => s[s.length - 1]).join(''));
//# sourceMappingURL=index.js.map
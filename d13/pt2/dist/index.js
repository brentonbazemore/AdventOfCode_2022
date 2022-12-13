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
const data = rawData.split('\n\n').flatMap(l => l.split('\n')).map(l => JSON.parse(l));
data.push(JSON.parse('[[2]]'));
data.push(JSON.parse('[[6]]'));
const compare = (left, right) => {
    if (right == undefined) {
        throw false;
    }
    if (left == undefined) {
        throw true;
    }
    if (Number.isInteger(left) && Number.isInteger(right)) {
        if (left === right) {
            return;
        }
        throw left < right;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
        if (left.length === 0 && right.length > 0) {
            throw true;
        }
        for (let i = 0; i < Math.max(left.length, right.length); i++) {
            compare(left[i], right[i]);
        }
        return;
    }
    if (Array.isArray(left) && Number.isInteger(right)) {
        return compare(left, [right]);
    }
    if (Number.isInteger(left) && Array.isArray(right)) {
        return compare([left], right);
    }
    return;
};
data.sort((left, right) => {
    let result;
    try {
        compare(left, right);
        result = true;
    }
    catch (e) {
        result = e;
    }
    return result ? -1 : 1;
});
const two = (data.findIndex(d => JSON.stringify(d) === '[[2]]') + 1);
const six = (data.findIndex(d => JSON.stringify(d) === '[[6]]') + 1);
console.log(two * six);
//# sourceMappingURL=index.js.map
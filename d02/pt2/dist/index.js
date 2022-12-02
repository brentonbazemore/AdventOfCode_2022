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
const map = {
    'A': 'ROCK',
    'X': 'LOSE',
    'B': 'PAPER',
    'Y': 'DRAW',
    'C': 'SCISSORS',
    'Z': 'WIN',
};
let totalScore = 0;
const win = 6;
const draw = 3;
const lose = 0;
const rock = 1;
const paper = 2;
const scissors = 3;
data.forEach(round => {
    const [them, me] = round.split(' ');
    if (map[them] === 'ROCK' && map[me] === 'LOSE') {
        totalScore += lose + scissors;
    }
    if (map[them] === 'ROCK' && map[me] === 'DRAW') {
        totalScore += draw + rock;
    }
    if (map[them] === 'ROCK' && map[me] === 'WIN') {
        totalScore += win + paper;
    }
    if (map[them] === 'PAPER' && map[me] === 'LOSE') {
        totalScore += lose + rock;
    }
    if (map[them] === 'PAPER' && map[me] === 'DRAW') {
        totalScore += draw + paper;
    }
    if (map[them] === 'PAPER' && map[me] === 'WIN') {
        totalScore += win + scissors;
    }
    if (map[them] === 'SCISSORS' && map[me] === 'LOSE') {
        totalScore += lose + paper;
    }
    if (map[them] === 'SCISSORS' && map[me] === 'DRAW') {
        totalScore += draw + scissors;
    }
    if (map[them] === 'SCISSORS' && map[me] === 'WIN') {
        totalScore += win + rock;
    }
});
console.log(totalScore);
// let totalScore = 0;
// data.forEach((round) => {
//   const [them, me] = round.split(' ');
//   let tempScore = 0;
//   if (them.charCodeAt(0) + 23 > me.charCodeAt(0)) {
//     console.log('lost');
//     tempScore += 0;
//   } else if (them.charCodeAt(0) + 23 === me.charCodeAt(0)) {
//     console.log('draw');
//     tempScore += 3;
//   } else if (them.charCodeAt(0) + 23 < me.charCodeAt(0)) {
//     console.log('win')
//     tempScore += 6;
//   } else {
//     throw new Error();
//   }
//   if (me === 'X') {
//     tempScore += 1;
//   }
//   if (me === 'Y') {
//     tempScore += 2;
//   }
//   if (me === 'Z') {
//     tempScore += 3;
//   }
//   // tempScore += me.charCodeAt(0) - 23 - 65 + 1;
//   totalScore += tempScore;
// });
// console.log(totalScore);
//# sourceMappingURL=index.js.map
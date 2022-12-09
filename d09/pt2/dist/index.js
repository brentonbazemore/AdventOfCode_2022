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
const knots = [];
for (let i = 0; i < 10; i++) {
    knots.push({ x: 0, y: 0 });
}
const checkAdjacency = (head, tail) => {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (head.x + i === tail.x && head.y + j == tail.y) {
                return true;
            }
        }
    }
    return false;
};
const coords2key = (coords) => {
    return `${coords.x}_${coords.y}`;
};
const visited = {};
const moveTail = (head, tail) => {
    if (!checkAdjacency(head, tail)) {
        if (head.x !== tail.x) {
            tail.x += Math.sign(head.x - tail.x);
        }
        if (head.y !== tail.y) {
            tail.y += Math.sign(head.y - tail.y);
        }
        // console.log('movin', knots);
    }
};
const move = {
    U: (head) => {
        head.y++;
    },
    D: (head) => {
        head.y--;
    },
    R: (head) => {
        head.x++;
    },
    L: (head) => {
        head.x--;
    },
};
data.forEach((rawMove) => {
    const [d, a] = rawMove.split(' ');
    const direction = d;
    const amount = +a;
    // console.log({direction, amount});
    for (let i = 0; i < amount; i++) {
        move[direction](knots[0]);
        for (let k = 0; k < knots.length - 1; k++) {
            const head = knots[k];
            const tail = knots[k + 1];
            moveTail(head, tail);
        }
        visited[coords2key(knots[9])] = true;
    }
});
console.log(Object.values(visited).length);
// console.log('final', knots);
// console.log(checkAdjacency(head, { x: 0, y: 0 }));
//# sourceMappingURL=index.js.map
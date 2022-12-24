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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const lcm_1 = __importDefault(require("lcm"));
const inputFile = process.argv[2];
const rawData = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data = rawData.split('\n');
const blizzards = {};
const bounds = {
    minX: 0,
    maxX: data[0].length - 1,
    minY: 0,
    maxY: data.length - 1,
};
const cycleWidth = (bounds.maxX - bounds.minX) + 1;
const cycleHeight = (bounds.maxY - bounds.minY) + 1;
const cycle = (0, lcm_1.default)(cycleWidth, cycleHeight);
const START = '0,-1';
const END = `${bounds.maxX},${bounds.maxY + 1}`;
for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
        if (['^', 'v', '<', '>'].includes(data[i][j])) {
            blizzards[`${j},${i}`] = data[i][j];
        }
    }
}
const mod = (n, m) => {
    return ((n % m) + m) % m;
};
const forecastBlizzard = (x, y, minute) => {
    const goingRight = blizzards[`${mod((x - minute), cycleWidth)},${y}`] === '>';
    const goingLeft = blizzards[`${mod((x + minute), cycleWidth)},${y}`] === '<';
    const goingUp = blizzards[`${x},${mod((y + minute), cycleHeight)}`] === '^';
    const goingDown = blizzards[`${x},${mod((y - minute), cycleHeight)}`] === 'v';
    return goingUp || goingDown || goingRight || goingLeft;
};
const isInBounds = (x, y) => {
    return (x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY) || `${x},${y}` === END || `${x},${y}` === START;
};
const getNeighbors = (node) => {
    const [x, y] = node.position.split(',').map(Number);
    const moves = [
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y }, // wait
    ].filter(move => {
        return isInBounds(move.x, move.y) && !forecastBlizzard(move.x, move.y, node.distance + 1);
    }).map(move => `${move.x},${move.y}`);
    return moves;
};
function bfs(start, target, startingDistance) {
    const queue = [{ position: start, distance: startingDistance }];
    const seen = new Set();
    seen.add(`${start}&${startingDistance}`);
    for (const node of queue) {
        if (node.position === target)
            return node.distance;
        for (const neighbor of getNeighbors(node)) {
            if (seen.has(`${neighbor}&${(node.distance + 1) % cycle}`))
                continue;
            seen.add(`${neighbor}&${(node.distance + 1) % cycle}`);
            queue.push({ position: neighbor, distance: node.distance + 1 });
        }
    }
    return -1;
}
let startingDistance = 0;
startingDistance = bfs(START, END, startingDistance);
startingDistance = bfs(END, START, startingDistance);
startingDistance = bfs(START, END, startingDistance);
console.log(startingDistance);
//# sourceMappingURL=index.js.map
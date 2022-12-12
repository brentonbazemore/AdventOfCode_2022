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
const heightMap = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach((letter, i) => heightMap[letter] = i);
heightMap['S'] = 0;
heightMap['E'] = 25;
const grid = [];
let start;
let end;
for (let y = 0; y < data.length; y++) {
    const row = [];
    for (let x = 0; x < data[0].length; x++) {
        row.push(heightMap[data[y][x]]);
        if (data[y][x] === 'S') {
            start = [x, y];
        }
        if (data[y][x] === 'E') {
            end = [x, y];
        }
    }
    grid.push(row);
}
const debug = (visited) => {
    let rows = [];
    for (let i = 0; i < data.length; i++) {
        rows.push([]);
        for (let j = 0; j < data[0].length; j++) {
            if (data[i][j] === 'E') {
                rows[i].push('!');
            }
            else {
                rows[i].push(' ');
            }
        }
    }
    visited.forEach(coord => {
        const [x, y] = coord.split(',').map(Number);
        rows[y][x] = '.';
    });
    if (visited.length > 0) {
        const [x, y] = visited[visited.length - 1].split(',').map(Number);
        rows[y][x] = '@';
    }
    console.clear();
    console.log((rows.forEach(r => console.log(r.join('')))));
};
if (end == null || start == null) {
    throw new Error('Messed up somewhere');
}
console.log(start, end);
const X = 0;
const Y = 1;
// let minSteps = 99999999999;
// const known: {[history: string]: number} = {};
// const findNextStep = (history: string[], last: [number, number], curr: [number, number]) => {
//   if (history.length >= minSteps) {
//     return Infinity;
//   }
//   if (history.includes(curr.join(','))) {
//     return Infinity;
//   }
//   if (known[history.join(';')] > minSteps) {
//     return known[history.join(';')];
//   }
//   const lastHeight = grid[last[Y]]?.[last[X]];
//   const currHeight = grid[curr[Y]]?.[curr[X]];
//   if (currHeight == undefined) {
//     return Infinity;
//   }
//   const step = currHeight - lastHeight;
//   if (step !== 1 && step !== 0) {
//     return Infinity;
//   }
//   if (curr[X] === end[X] && curr[Y] === end[Y]) {
//     minSteps = Math.min(history.length, minSteps);
//     return history.length;
//   }
//   debug(history);
//   const [x, y] = curr;
//   const candidates: [number, number][] = [
//     [ x, y - 1 ], 
//     [ x + 1, y ], 
//     [ x - 1, y ],
//     [ x, y + 1 ], 
//   ].sort((a, b) => grid[b[Y]]?.[b[X]] - grid[a[Y]]?.[a[X]]) as any;
//   const min = Math.min(...candidates.map(candidate => {
//     const newHistory = [...history, curr.join(',')];
//     return findNextStep(newHistory, curr, candidate);
//   }));
//   known[[...history, curr.join(',')].join(';')] = min;
//   return min
// }
// findNextStep([], start, start);
// console.log(minSteps);
const getNeighbors = (curr) => {
    const [x, y] = curr;
    const candidates = [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y],
    ].filter(candidate => {
        const currHeight = grid[curr[Y]]?.[curr[X]];
        const nextHeight = grid[candidate[Y]]?.[candidate[X]];
        if (currHeight == undefined || nextHeight == undefined) {
            return false;
        }
        const step = nextHeight - currHeight;
        if (step > 1) {
            return false;
        }
        return true;
    }).sort((a, b) => grid[b[Y]]?.[b[X]] - grid[a[Y]]?.[a[X]]);
    return candidates;
};
const endString = end.join(',');
const bfs = (target) => {
    const queue = [{ position: start, distance: 0 }]; // 1. Initialize queue with Node and current distance 0
    const seen = new Set(); // 2. Initialize set
    while (queue.length > 0) {
        console.log(debug(Array.from(seen.values())));
        const { position, distance } = queue.shift();
        if (position.join(',') === target) {
            return distance;
        }
        for (const neighbor of getNeighbors(position)) { // 5. Get next possible moves (neighbor nodes)
            if (seen.has(neighbor.join(','))) {
                continue; // 6. Skip seen nodes
            }
            seen.add(neighbor.join(',')); // 7. Mark next node as seen.
            queue.push({ position: neighbor, distance: distance + 1 }); // 8. Add neighbor to queue and increase the distance.
        }
    }
    return -1; // 9. If you didn't find the answer, return something like -1/null/undefined.
};
console.log(bfs(endString));
//# sourceMappingURL=index.js.map
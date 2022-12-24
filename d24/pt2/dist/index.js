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
let locations = {};
const bounds = {
    minX: 1,
    maxX: data[0].length - 2,
    minY: 1,
    maxY: data.length - 2,
};
const START = '1,0';
const END = `${data[0].length - 2},${data.length - 1}`;
const getFreshLocations = () => {
    const fresh = {};
    fresh[START] = [];
    for (let i = 1; i < data.length - 1; i++) {
        for (let j = 1; j < data[0].length - 1; j++) {
            fresh[`${j},${i}`] = [];
        }
    }
    fresh[END] = [];
    return fresh;
};
locations = getFreshLocations();
for (let i = 1; i < data.length - 1; i++) {
    for (let j = 1; j < data[0].length - 1; j++) {
        if (['^', 'v', '<', '>'].includes(data[i][j])) {
            locations[`${j},${i}`].push(data[i][j]);
        }
    }
}
const print = (loc) => {
    for (let y = 0; y < data.length; y++) {
        let row = '';
        for (let x = 0; x < data[0].length; x++) {
            if (loc[`${x},${y}`] == null) {
                row += '#';
            }
            else if (loc[`${x},${y}`].length === 0) {
                row += '.';
            }
            else if (loc[`${x},${y}`].length === 1) {
                row += loc[`${x},${y}`];
            }
            else if (loc[`${x},${y}`].length > 1) {
                row += loc[`${x},${y}`].length;
            }
        }
        console.log(row);
    }
};
const tick = (prevLocations) => {
    const newLocations = getFreshLocations();
    Object.keys(prevLocations).forEach(location => {
        const blizzards = prevLocations[location];
        if (blizzards.length === 0) {
            return;
        }
        const [x, y] = location.split(',').map(Number);
        blizzards.forEach((blizzard) => {
            let newX = x;
            let newY = y;
            if (blizzard === '^') {
                newY--;
                if (newY < bounds.minY) {
                    newY = bounds.maxY;
                }
            }
            else if (blizzard === 'v') {
                newY++;
                if (newY > bounds.maxY) {
                    newY = bounds.minY;
                }
            }
            else if (blizzard === '<') {
                newX--;
                if (newX < bounds.minX) {
                    newX = bounds.maxX;
                }
            }
            else if (blizzard === '>') {
                newX++;
                if (newX > bounds.maxX) {
                    newX = bounds.minX;
                }
            }
            newLocations[`${newX},${newY}`].push(blizzard);
        });
    });
    return newLocations;
};
const getNeighbors = (node) => {
    const [x, y] = node.position.split(',').map(Number);
    const currBlizzard = JSON.parse(node.blizzards);
    const nextBlizzard = tick(currBlizzard);
    const nextBlizzardString = JSON.stringify(nextBlizzard);
    const up = `${x},${y - 1}`;
    const down = `${x},${y + 1}`;
    const left = `${x - 1},${y}`;
    const right = `${x + 1},${y}`;
    const wait = `${x},${y}`;
    const next = [];
    if (nextBlizzard[up] != null && nextBlizzard[up].length === 0) {
        next.push({ position: up, blizzardMap: nextBlizzardString });
    }
    if (nextBlizzard[down] != null && nextBlizzard[down].length === 0) {
        next.push({ position: down, blizzardMap: nextBlizzardString });
    }
    if (nextBlizzard[left] != null && nextBlizzard[left].length === 0) {
        next.push({ position: left, blizzardMap: nextBlizzardString });
    }
    if (nextBlizzard[right] != null && nextBlizzard[right].length === 0) {
        next.push({ position: right, blizzardMap: nextBlizzardString });
    }
    if (nextBlizzard[wait] != null && nextBlizzard[wait].length === 0) {
        next.push({ position: wait, blizzardMap: nextBlizzardString });
    }
    return next;
};
// const simulate = (position: string, target: string, timeElapsed: number, blizzards: string): number => {
//   if (position === target) {
//     return timeElapsed;
//   }
//   if (timeElapsed > 100) {
//     return timeElapsed;
//   }
//   const possibleDecisions = getNeighbors({ position, blizzards });
//   const out = possibleDecisions.map(step => {
//     return simulate(step.position, target, timeElapsed + 1, step.blizzardMap);
//   })
//   return Math.min(...out, Infinity);
// }
// const result = simulate(START, END, 0, JSON.stringify(locations));
// console.log(result);
function bfs(target, initialBlizzards) {
    const cycleWidth = (bounds.maxX - bounds.minX) + 1;
    const cycleHeight = (bounds.maxY - bounds.minY) + 1;
    const cycle = cycleWidth * cycleHeight;
    const queue = [{ position: START, distance: 0, blizzards: initialBlizzards }];
    const seen = new Set();
    seen.add(`${START}&${0}`);
    for (const node of queue) {
        if (node.position === target)
            return node.distance;
        for (const neighbor of getNeighbors(node)) {
            if (seen.has(`${neighbor.position}&${(node.distance + 1) % 600}`))
                continue;
            seen.add(`${neighbor.position}&${(node.distance + 1) % 600}`);
            queue.push({ position: neighbor.position, distance: node.distance + 1, blizzards: neighbor.blizzardMap });
        }
    }
    return -1;
}
const path = bfs(END, JSON.stringify(locations));
console.log(path);
// let loc = locations;
// for (let i = 0; i < 5; i++) {
//   loc = tick(loc);
//   print(loc);
// }
//# sourceMappingURL=index.js.map
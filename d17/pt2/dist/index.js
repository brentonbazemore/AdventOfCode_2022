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
const data = rawData.split('');
class Shape {
    bounds = {
        maxX: 6,
        minX: 0
    };
    raw;
    height;
    width;
    position;
    pointMapCache = null;
    constructor(rawShape, startingY) {
        this.raw = rawShape.split('\n').reverse();
        this.height = this.raw.length;
        this.width = this.raw[0].length;
        // bottom left coord of the bounding square
        this.position = { x: 2, y: startingY };
    }
    moveLeft(filledPoints) {
        this.position.x--;
        this.pointMapCache = null;
        if (this.detectCollision(filledPoints)) {
            this.pointMapCache = null;
            this.position.x++;
        }
    }
    moveRight(filledPoints) {
        this.position.x++;
        this.pointMapCache = null;
        if (this.detectCollision(filledPoints)) {
            this.pointMapCache = null;
            this.position.x--;
        }
    }
    // returns if did move
    moveDown(filledPoints) {
        this.position.y--;
        this.pointMapCache = null;
        if (this.detectCollision(filledPoints)) {
            this.pointMapCache = null;
            this.position.y++;
            return false;
        }
        return true;
    }
    detectCollision(filledPoints) {
        const thisPoints = this.getPointMap();
        for (let i = 0; i < thisPoints.length; i++) {
            if (filledPoints.has(thisPoints[i])) {
                return true;
            }
        }
        return false;
    }
    getPointMap() {
        if (this.pointMapCache) {
            return this.pointMapCache;
        }
        const points = [];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.raw[i][j] === '#') {
                    points.push(`${this.position.x + j}_${this.position.y + i}`);
                }
            }
        }
        this.pointMapCache = points;
        return points;
    }
}
const shapes = [
    `####`,
    `.#.
###
.#.`,
    `..#
..#
###`,
    `#
#
#
#`,
    `##
##`
];
const filledPoints = new Set([
    '0_-1',
    '1_-1',
    '2_-1',
    '3_-1',
    '4_-1',
    '5_-1',
    '6_-1',
]);
// const print = (shape: Shape, layers: number = spawnHeight + 1) => {
//   const rows: string[][] = [];
//   for (let i = spawnHeight; i >= spawnHeight - layers; i--) {
//     let row = [];
//     for (let j = -1; j < 8; j++) {
//       if (shape.getPointMap().includes(`${j}_${i}`)) {
//         row.push('@');
//       } else if (filledPoints.has(`${j}_${i}`)) {
//         row.push('#');
//       } else {
//         row.push('.');
//       }
//     }
//     rows.push(row)
//   }
//   rows.forEach(r => console.log(r.join('')));
//   console.log('\n\n');
// }
const lockInPoints = (shape) => {
    const points = shape.getPointMap();
    points.forEach(point => filledPoints.add(point));
};
// const cycleSize = shapes.length * data.length;
const simulate = (initJetPointer, initSpawn, spawnCount, initSpawnHeight) => {
    let spawnHeight = initSpawnHeight;
    let jetPointer = initJetPointer;
    for (let i = initSpawn; i < initSpawn + spawnCount; i++) {
        console.log({ i });
        const shape = new Shape(shapes[i % shapes.length], spawnHeight);
        for (let j = 3; j >= 0; j--) {
            filledPoints.add(`-1_${spawnHeight - j}`);
            filledPoints.add(`7_${spawnHeight - j}`);
        }
        // 1184 4
        // if (jetPointer % data.length === 1184 && i % shapes.length === 4) {
        // if (jetPointer % data.length === 5 && i % shapes.length === 0) {
        //   console.log({ i, spawnHeight });
        //   // print(shape, 10);
        // }
        let didMoveDown = true;
        while (didMoveDown) {
            const direction = data[jetPointer % data.length];
            if (direction === '>') {
                shape.moveRight(filledPoints);
            }
            else {
                shape.moveLeft(filledPoints);
            }
            jetPointer++;
            didMoveDown = shape.moveDown(filledPoints);
        }
        lockInPoints(shape);
        spawnHeight = Math.max(spawnHeight, shape.position.y + shape.height + 3);
    }
    console.log((spawnHeight - 3));
    return {
        spawnHeight,
        jetPointer: jetPointer % data.length,
        spawnCount: initSpawn + spawnCount,
    };
};
// Test:
// interval = 35
// height at interval = 53
// height before interval = 54 (-3?)
// spawns before interval = 30
// spawns after interval = 20
// height after interval = 24?
// Real:
// interval = 1745
// height at interval = 2783
// height before interval = 349
// spawns before interval = 209
// spawns after interval = 944
// height after interval = ?
const spawnInterval = 1745;
const heightInterval = 2783;
const preCycle = simulate(0, 0, 209, 3);
const fullCycleCount = Math.floor((1000000000000 - preCycle.spawnCount) / spawnInterval);
const spawnsLeft = (1000000000000 - preCycle.spawnCount) % spawnInterval;
const heightSoFar = preCycle.spawnHeight + (heightInterval * fullCycleCount);
const spawnsSoFar = preCycle.spawnCount + (spawnInterval * fullCycleCount);
console.log(preCycle.jetPointer, { spawnsSoFar, spawnsLeft, heightSoFar });
const postCycle = simulate(preCycle.jetPointer, preCycle.spawnCount, spawnsLeft, preCycle.spawnHeight);
console.log(postCycle);
console.log((heightSoFar + (postCycle.spawnHeight - preCycle.spawnHeight)) - 3);
//# sourceMappingURL=index.js.map
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
const print = (shape) => {
    const rows = [];
    for (let i = spawnHeight; i >= -1; i--) {
        let row = [];
        for (let j = -1; j < 8; j++) {
            if (shape.getPointMap().includes(`${j}_${i}`)) {
                row.push('@');
            }
            else if (filledPoints.has(`${j}_${i}`)) {
                row.push('#');
            }
            else {
                row.push('.');
            }
        }
        rows.push(row);
    }
    rows.forEach(r => console.log(r.join('')));
    console.log('\n\n');
};
const lockInPoints = (shape) => {
    const points = shape.getPointMap();
    points.forEach(point => filledPoints.add(point));
};
let spawnHeight = 3;
const spawnCount = 2022;
let jetPointer = 0;
for (let i = 0; i < spawnCount; i++) {
    const shape = new Shape(shapes[i % shapes.length], spawnHeight);
    for (let i = 3; i >= 0; i--) {
        filledPoints.add(`-1_${spawnHeight - i}`);
        filledPoints.add(`7_${spawnHeight - i}`);
    }
    let didMoveDown = true;
    while (didMoveDown) {
        const direction = data[jetPointer % data.length];
        // console.log(direction);
        if (direction === '>') {
            shape.moveRight(filledPoints);
        }
        else {
            shape.moveLeft(filledPoints);
        }
        // print(shape);
        jetPointer++;
        didMoveDown = shape.moveDown(filledPoints);
        // console.log('V')
        // print(shape);
    }
    lockInPoints(shape);
    spawnHeight = Math.max(spawnHeight, shape.position.y + shape.height + 3);
}
console.log(spawnHeight - 3);
//# sourceMappingURL=index.js.map
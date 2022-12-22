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
const [rawBoardData, instructionData] = rawData.split('\n\n');
const boardData = rawBoardData.split('\n');
var Tile;
(function (Tile) {
    Tile["Open"] = ".";
    Tile["Wall"] = "#";
    Tile["OOB"] = " ";
})(Tile || (Tile = {}));
let boardWidth = 0;
const boardHeight = boardData.length;
for (let i = 0; i < boardData.length; i++) {
    boardWidth = Math.max(boardWidth, boardData[i].length);
}
let start = null;
const normalizedBoard = {};
for (let y = 0; y < boardData.length; y++) {
    const row = boardData[y];
    for (let x = 0; x < boardWidth; x++) {
        if (y === 0 && start == null && row[x] == Tile.Open) {
            start = { x, y };
        }
        if (row[x] == undefined) {
            normalizedBoard[`${x},${y}`] = Tile.OOB;
        }
        else {
            normalizedBoard[`${x},${y}`] = row[x];
        }
    }
}
class TileNode {
    up; // ignore that these aren't defined in constructor because I'll force a call to init on a second pass
    down;
    left;
    right;
    tile;
    x;
    y;
    constructor(x, y, tile) {
        this.tile = tile;
        this.x = x;
        this.y = y;
    }
    link(tiles) {
        let upY = this.y - 1;
        while (true) {
            if (upY < 0) {
                upY = boardHeight - 1;
            }
            if (tiles[`${this.x},${upY}`] != undefined) {
                this.up = `${this.x},${upY}`;
                break;
            }
            upY--;
        }
        let downY = this.y + 1;
        while (true) {
            if (downY >= boardHeight) { // TODO: verify off by one
                downY = 0;
            }
            if (tiles[`${this.x},${downY}`] != undefined) {
                this.down = `${this.x},${downY}`;
                break;
            }
            downY++;
        }
        let rightX = this.x + 1;
        while (true) {
            if (rightX >= boardWidth) {
                rightX = 0;
            }
            if (tiles[`${rightX},${this.y}`] != undefined) {
                this.right = `${rightX},${this.y}`;
                break;
            }
            rightX++;
        }
        let leftX = this.x - 1;
        while (true) {
            if (leftX < 0) {
                leftX = boardWidth - 1;
            }
            if (tiles[`${leftX},${this.y}`] != undefined) {
                this.left = `${leftX},${this.y}`;
                break;
            }
            leftX--;
        }
    }
}
const boardTiles = {};
for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
        const coord = `${x},${y}`;
        if (normalizedBoard[coord] !== Tile.OOB) {
            boardTiles[coord] = new TileNode(x, y, normalizedBoard[coord]);
        }
    }
}
for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
        const coord = `${x},${y}`;
        if (boardTiles[coord] != undefined) {
            boardTiles[coord].link(boardTiles);
        }
    }
}
const rawInstructions = instructionData.split('');
const instructions = [];
let nextJob = 'number';
while (rawInstructions.length > 0) {
    if (nextJob === 'number') {
        const digits = [];
        for (let i = 0; i < 4; i++) {
            if (rawInstructions[0] === 'L' || rawInstructions[0] === 'R') {
                break;
            }
            digits.push(rawInstructions.shift());
        }
        instructions.push({ type: 'move', value: +digits.join('') });
        nextJob = 'letter';
    }
    else if (nextJob === 'letter') {
        instructions.push({ type: 'turn', value: rawInstructions.shift() });
        nextJob = 'number';
    }
}
var Direction;
(function (Direction) {
    Direction[Direction["R"] = 0] = "R";
    Direction[Direction["D"] = 1] = "D";
    Direction[Direction["L"] = 2] = "L";
    Direction[Direction["U"] = 3] = "U";
})(Direction || (Direction = {}));
let position = start;
let direction = Direction.R;
const move = (inst) => {
    let nextTile = boardTiles[`${position.x},${position.y}`];
    if (direction === Direction.R) {
        for (let i = 0; i < inst.value; i++) {
            const peakTile = boardTiles[nextTile.right];
            if (peakTile.tile === Tile.Wall) {
                // return nextTile;
                break;
            }
            nextTile = peakTile;
        }
    }
    else if (direction === Direction.L) {
        for (let i = 0; i < inst.value; i++) {
            const peakTile = boardTiles[nextTile.left];
            if (peakTile.tile === Tile.Wall) {
                // return nextTile;
                break;
            }
            nextTile = peakTile;
        }
    }
    else if (direction === Direction.U) {
        for (let i = 0; i < inst.value; i++) {
            const peakTile = boardTiles[nextTile.up];
            if (peakTile.tile === Tile.Wall) {
                // return nextTile;
                break;
            }
            nextTile = peakTile;
        }
    }
    else if (direction === Direction.D) {
        for (let i = 0; i < inst.value; i++) {
            const peakTile = boardTiles[nextTile.down];
            if (peakTile.tile === Tile.Wall) {
                // return nextTile;
                break;
            }
            nextTile = peakTile;
        }
    }
    else {
        throw new Error('invalid move');
    }
    position = { x: nextTile.x, y: nextTile.y };
};
const leftTurn = {
    [Direction.U]: Direction.L,
    [Direction.L]: Direction.D,
    [Direction.D]: Direction.R,
    [Direction.R]: Direction.U,
};
const rightTurn = {
    [Direction.U]: Direction.R,
    [Direction.R]: Direction.D,
    [Direction.D]: Direction.L,
    [Direction.L]: Direction.U,
};
const turn = (inst) => {
    if (inst.value === 'L') {
        direction = leftTurn[direction];
    }
    else if (inst.value === 'R') {
        direction = rightTurn[direction];
    }
    else {
        throw new Error('invalid turn');
    }
};
const instMap = {
    'move': move,
    'turn': turn,
};
for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    instMap[instruction.type](instruction);
    // console.log(position, Direction[direction]);
}
console.log(((position.y + 1) * 1000) + ((position.x + 1) * 4) + direction);
// console.log(boardTiles);
//# sourceMappingURL=index.js.map
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
var Tile;
(function (Tile) {
    Tile["Elf"] = "#";
    Tile["Empty"] = ".";
})(Tile || (Tile = {}));
const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
};
const updateBounds = (x, y) => {
    bounds.minX = Math.min(bounds.minX, x);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxY = Math.max(bounds.maxY, y);
};
const field = {};
for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
        if (data[y][x] === Tile.Elf) {
            field[`${x},${y}`] = data[y][x];
            updateBounds(x, y);
        }
    }
}
const print = () => {
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
        let row = '';
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
            row += (field[`${x},${y}`] === Tile.Elf ? '#' : ' ');
        }
        console.log(row);
    }
};
console.log(bounds);
print();
const getAvailability = (x, y) => {
    // a position is elf'd if false
    return {
        N: field[`${x},${y - 1}`] !== Tile.Elf,
        NE: field[`${x + 1},${y - 1}`] !== Tile.Elf,
        E: field[`${x + 1},${y}`] !== Tile.Elf,
        SE: field[`${x + 1},${y + 1}`] !== Tile.Elf,
        S: field[`${x},${y + 1}`] !== Tile.Elf,
        SW: field[`${x - 1},${y + 1}`] !== Tile.Elf,
        W: field[`${x - 1},${y}`] !== Tile.Elf,
        NW: field[`${x - 1},${y - 1}`] !== Tile.Elf,
    };
};
const directionOrder = [
    (x, y) => {
        // 'north', 
        const { N, NE, NW } = getAvailability(x, y);
        return {
            isValid: N && NE && NW,
            next: `${x},${y - 1}`,
        };
    },
    (x, y) => {
        // 'south', 
        const { S, SE, SW } = getAvailability(x, y);
        return {
            isValid: S && SE && SW,
            next: `${x},${y + 1}`,
        };
    },
    (x, y) => {
        // 'west', 
        const { W, NW, SW } = getAvailability(x, y);
        return {
            isValid: W && NW && SW,
            next: `${x - 1},${y}`,
        };
    },
    (x, y) => {
        // 'east'
        const { E, NE, SE } = getAvailability(x, y);
        return {
            isValid: E && NE && SE,
            next: `${x + 1},${y}`,
        };
    },
];
const directions = ['north', 'south', 'west', 'east'];
const totalRounds = 10;
for (let i = 0; i < totalRounds; i++) {
    const proposals = {};
    Object.keys(field).forEach(elf => {
        const [x, y] = elf.split(',').map(Number);
        const { N, NE, E, SE, S, SW, W, NW } = getAvailability(x, y);
        if (N && NE && E && SE && S && SW && W && NW) {
            // do nothing if nobody is around
            return;
        }
        let proposed;
        for (let j = 0; j < directionOrder.length; j++) {
            const nthDirection = (j + i) % directionOrder.length;
            const d = directionOrder[nthDirection](x, y);
            if (d.isValid) {
                proposed = d.next;
                break;
            }
        }
        if (proposed != null) {
            if (proposals[proposed] != null) {
                proposals[proposed].push(elf);
            }
            else {
                proposals[proposed] = [elf];
            }
        }
    });
    Object.keys(proposals).forEach(proposedCoord => {
        if (proposals[proposedCoord].length === 1) {
            const [x, y] = proposedCoord.split(',').map(Number);
            updateBounds(x, y);
            const currentCoord = proposals[proposedCoord][0];
            delete field[currentCoord];
            field[proposedCoord] = Tile.Elf;
        }
        else {
            // do nothing?
        }
    });
    console.log('End Round', i);
    // print();
}
const getBounds = () => {
    const bounds = {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
    };
    Object.keys(field).forEach(coord => {
        const [x, y] = coord.split(',').map(Number);
        bounds.minX = Math.min(bounds.minX, x);
        bounds.maxX = Math.max(bounds.maxX, x);
        bounds.minY = Math.min(bounds.minY, y);
        bounds.maxY = Math.max(bounds.maxY, y);
    });
    return bounds;
};
const { maxX, minX, maxY, minY } = getBounds();
// for (let y = finalBounds.minY; y < finalBounds.maxY; y++) {
//   for (let x = finalBounds.minX; x < finalBounds.maxX; x++) {
//     if ()
//   }
// }
const width = (maxX - minX) + 1;
const height = (maxY - minY) + 1;
console.log((width * height) - Object.keys(field).length);
//# sourceMappingURL=index.js.map
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
console.time();
const inputFile = process.argv[2];
const rawData = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data = rawData.split('\n');
// build out the object, then find the surface area visible from each of the six sides
// on second thought, maybe just keep track of exposed surface while adding
// well for part 2 it looks like I had the right idea lol
// nope it wasn't because there can be pieces hidden to a "raycast", but still exposed to air (like a tunnel)
const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity,
};
const lava = {};
data.forEach(coord => {
    const [x, y, z] = coord.split(',').map(Number);
    bounds.minX = Math.min(x, bounds.minX);
    bounds.maxX = Math.max(x, bounds.maxX);
    bounds.minY = Math.min(y, bounds.minY);
    bounds.maxY = Math.max(y, bounds.maxY);
    bounds.minZ = Math.min(z, bounds.minZ);
    bounds.maxZ = Math.max(z, bounds.maxZ);
    let sides = 6;
    if (lava[`${x + 1},${y},${z}`] != undefined) {
        lava[`${x + 1},${y},${z}`]--;
        sides--;
    }
    if (lava[`${x - 1},${y},${z}`] != undefined) {
        lava[`${x - 1},${y},${z}`]--;
        sides--;
    }
    if (lava[`${x},${y + 1},${z}`] != undefined) {
        lava[`${x},${y + 1},${z}`]--;
        sides--;
    }
    if (lava[`${x},${y - 1},${z}`] != undefined) {
        lava[`${x},${y - 1},${z}`]--;
        sides--;
    }
    if (lava[`${x},${y},${z + 1}`] != undefined) {
        lava[`${x},${y},${z + 1}`]--;
        sides--;
    }
    if (lava[`${x},${y},${z - 1}`] != undefined) {
        lava[`${x},${y},${z - 1}`]--;
        sides--;
    }
    lava[coord] = sides;
});
const airBounds = new Set();
for (let x = bounds.minX; x <= bounds.maxX; x++) {
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
        airBounds.add(`${x},${y},${bounds.minZ}`);
        airBounds.add(`${x},${y},${bounds.maxZ}`);
    }
}
for (let x = bounds.minX; x <= bounds.maxX; x++) {
    for (let z = bounds.minZ; z <= bounds.maxZ; z++) {
        airBounds.add(`${x},${bounds.minY},${z}`);
        airBounds.add(`${x},${bounds.maxY},${z}`);
    }
}
for (let y = bounds.minY; y <= bounds.maxY; y++) {
    for (let z = bounds.minZ; z <= bounds.maxZ; z++) {
        airBounds.add(`${bounds.minX},${y},${z}`);
        airBounds.add(`${bounds.maxX},${y},${z}`);
    }
}
const airs = {};
for (let x = bounds.minX + 1; x < bounds.maxX; x++) {
    for (let y = bounds.minY + 1; y < bounds.maxY; y++) {
        for (let z = bounds.minZ + 1; z < bounds.maxZ; z++) {
            if (lava[`${x},${y},${z}`] != undefined) {
                continue;
            }
            airs[`${x},${y},${z}`] = true;
        }
    }
}
const getNeighbors = ({ x, y, z }) => {
    return [
        { x: x + 1, y, z },
        { x: x - 1, y, z },
        { x, y: y + 1, z },
        { x, y: y - 1, z },
        { x, y, z: z + 1 },
        { x, y, z: z - 1 },
    ].filter((pos) => lava[`${pos.x},${pos.y},${pos.z}`] === undefined);
};
const findAir = (start, openAirBoundary) => {
    const queue = [{ position: start, distance: 0 }];
    const seen = new Set(`${start.x},${start.y},${start.z}`);
    for (const { position, distance } of queue) {
        if (openAirBoundary.has(`${position.x},${position.y},${position.z}`)) {
            return distance;
        }
        for (const neighbor of getNeighbors(position)) {
            const key = `${neighbor.x},${neighbor.y},${neighbor.z}`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            queue.push({ position: neighbor, distance: distance + 1 });
        }
    }
    return -1;
};
Object.keys(airs).forEach(pos => {
    const [x, y, z] = pos.split(',').map(Number);
    if (findAir({ x, y, z }, airBounds) === -1) {
        // console.log({ x, y, z}, 'is not exposed');
        if (lava[`${x + 1},${y},${z}`] != undefined) {
            lava[`${x + 1},${y},${z}`]--;
        }
        if (lava[`${x - 1},${y},${z}`] != undefined) {
            lava[`${x - 1},${y},${z}`]--;
        }
        if (lava[`${x},${y + 1},${z}`] != undefined) {
            lava[`${x},${y + 1},${z}`]--;
        }
        if (lava[`${x},${y - 1},${z}`] != undefined) {
            lava[`${x},${y - 1},${z}`]--;
        }
        if (lava[`${x},${y},${z + 1}`] != undefined) {
            lava[`${x},${y},${z + 1}`]--;
        }
        if (lava[`${x},${y},${z - 1}`] != undefined) {
            lava[`${x},${y},${z - 1}`]--;
        }
    }
});
const surfaceArea = Object.values(lava).reduce((prev, curr) => prev + curr, 0);
console.log(surfaceArea);
console.timeEnd();
//# sourceMappingURL=index.js.map
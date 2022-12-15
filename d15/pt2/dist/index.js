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
const testing = inputFile != 'input.txt';
const rawData = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data = rawData.split('\n');
const getDistance = (a, b) => {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
};
const locations = data.map(line => {
    const [rawSensor, rawBeacon] = line.split(': ');
    const rawSensorCoords = rawSensor.split('Sensor at ')[1];
    const [rawSensorX, rawSensorY] = rawSensorCoords.split(', ');
    const sensorX = +rawSensorX.split('=')[1];
    const sensorY = +rawSensorY.split('=')[1];
    const rawBeaconCoords = rawBeacon.split('closest beacon is at ')[1];
    const [rawBeaconX, rawBeaconY] = rawBeaconCoords.split(', ');
    const beaconX = +rawBeaconX.split('=')[1];
    const beaconY = +rawBeaconY.split('=')[1];
    return {
        sensor: {
            x: sensorX,
            y: sensorY,
        },
        beacon: {
            x: beaconX,
            y: beaconY,
        },
        distance: getDistance({ x: sensorX, y: sensorY }, { x: beaconX, y: beaconY }),
    };
});
const caveRanges = [];
const bounds = {
    minX: testing ? 0 : 0,
    maxX: testing ? 20 : 4000000,
    minY: testing ? 0 : 0,
    maxY: testing ? 20 : 4000000,
};
for (let i = 0; i <= 4000000; i++) {
    caveRanges[i] = [];
}
const drawArea = ({ sensor, beacon, distance }) => {
    for (let y = sensor.y - distance; y <= sensor.y + distance; y++) {
        if (y < bounds.minY || y > bounds.maxY) {
            continue;
        }
        const ranges = caveRanges[y];
        const extent = Math.abs(y - sensor.y);
        const start = sensor.x - (distance - extent);
        const end = sensor.x + (distance - extent);
        ranges.push({ start, end });
    }
};
locations.forEach((location, i) => {
    console.log(location, i);
    drawArea(location);
});
const merge = (ranges) => {
    ranges.sort((a, b) => a.start - b.start);
    if (ranges.length < 2) {
        return ranges;
    }
    const merged = [];
    let prev = ranges[0];
    for (let i = 1; i < ranges.length; i++) {
        if (prev.end >= ranges[i].start) {
            prev.end = Math.max(prev.end, ranges[i].end);
        }
        else {
            merged.push(prev);
            prev = ranges[i];
        }
    }
    merged.push(prev);
    if (merged.length === 2) {
        const [a, b] = merged;
        if (a.start <= b.end && a.end >= b.start || (a.end === b.start - 1)) {
            a.end = Math.max(a.end, b.end);
            merged.pop();
        }
    }
    return merged;
};
const merged = caveRanges.map((y, i) => {
    return merge(merge(y));
});
for (let i = 0; i < merged.length; i++) {
    const m = merged[i];
    if (m.length === 2) {
        console.log(((m[0].end + 1) * 4000000) + i);
        break;
    }
}
//# sourceMappingURL=index.js.map
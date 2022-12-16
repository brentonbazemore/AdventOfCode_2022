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
const valves = {};
data.forEach(rawValve => {
    const [, name, , , rawRate, , , , , ...children] = rawValve.replaceAll(',', '').split(' ');
    const rate = +rawRate.split('=')[1].split(';')[0];
    valves[name] = { name, rate, children };
});
// premap each of the working valves to each other so that I can cut out the middle steps
const getNextValve = (valveId) => {
    const next = valves[valveId].children;
    return next;
};
const findShortestDistance = (start, end) => {
    const queue = [{ position: start, distance: 0 }];
    const seen = new Set();
    while (queue.length > 0) {
        const { position, distance } = queue.shift();
        if (position === end) {
            return distance;
        }
        for (const nextPosition of getNextValve(position)) {
            if (seen.has(nextPosition)) {
                continue;
            }
            seen.add(nextPosition);
            queue.push({ position: nextPosition, distance: distance + 1 });
        }
    }
    return -1;
};
const distances = {};
const valveArray = Object.values(valves);
for (let i = 0; i < valveArray.length; i++) {
    const valveA = valveArray[i];
    for (let j = 0; j < valveArray.length; j++) {
        if (i === j) {
            continue;
        }
        const valveB = valveArray[j];
        if (valveA.rate === 0 || valveB.rate === 0) {
            if (valveA.name === 'AA') {
                if (valveB.rate === 0) {
                    continue;
                }
            }
            else {
                continue;
            }
        }
        if (!distances[valveA.name]) {
            distances[valveA.name] = {};
        }
        distances[valveA.name][valveB.name] = findShortestDistance(valveA.name, valveB.name) + 1; // +1 is activation cost
    }
}
console.log(JSON.stringify(distances, null, 2));
const makeDecision = (valve, decisions, timeLeft) => {
    // console.log({valve, decisions })
    // if (timeLeft >= 25) {
    //   console.log(decisions);
    // }
    // console.log(decisions);
    if (timeLeft <= 0) {
        return 0;
    }
    let totalRate = 0;
    // const lastDecision = decisions.slice(-2);
    // const lastLast = decisions.slice(-5, -3);
    // const [a, b] = lastDecision.split('->')!;
    // if (a === b) {
    totalRate += (valve.rate * timeLeft);
    // }
    // if (valve.rate > 0) {
    //   const nextDecision = valve.name;
    //   if (!decisions.includes(nextDecision)) {
    //     // possibleDecisions.push({ valve, nextDecision, timeConsumed: 1 });
    //     return totalRate + makeDecision(valve, decisions + ',' + nextDecision, timeLeft - 1);
    //   }
    // }
    const possibleDecisions = [];
    // console.log('valve.name', valve.name);
    const childrenIds = Object.keys(distances[valve.name]);
    for (let i = 0; i < childrenIds.length; i++) {
        const childId = childrenIds[i];
        const nextDecision = childId;
        if (decisions.includes(nextDecision)) {
            continue;
        }
        if (timeLeft - distances[valve.name][childId] < 0) {
            continue;
        }
        possibleDecisions.push({ valve: valves[childId], nextDecision, timeConsumed: distances[valve.name][childId] });
    }
    if (possibleDecisions.length > 0) {
        totalRate += Math.max(...possibleDecisions.map(dec => makeDecision(dec.valve, decisions + ',' + dec.nextDecision, timeLeft - dec.timeConsumed)));
    }
    // known[decisions] = totalRate;
    return totalRate;
};
console.log(makeDecision(valves['AA'], 'AA', 30));
//# sourceMappingURL=index.js.map
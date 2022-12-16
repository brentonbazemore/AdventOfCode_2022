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
const _ = __importStar(require("lodash"));
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
// AA DD JJ BB HH CC EE
console.log(JSON.stringify(distances, null, 2));
throw new Error();
const AAChildren = Object.keys(distances['AA']);
const makeDecision = (me, ele, decisions) => {
    if (me.timeLeft <= 0 && ele.timeLeft <= 0) {
        return 0;
    }
    // console.log(decisions);
    let totalRate = 0;
    const visited = decisions.split(',');
    const availableIds = _.difference(AAChildren, visited);
    if (availableIds.length === 0) {
        return me.timeLeft * valves[me.id].rate + ele.timeLeft * valves[ele.id].rate;
    }
    const maxOut = [];
    for (let i = 0; i < availableIds.length; i++) {
        const nextId = availableIds[i];
        if (me.timeLeft === ele.timeLeft) {
            // console.log('=')
            const meOut = { realized: (valves[me.id].rate * me.timeLeft), children: makeDecision({ id: nextId, timeLeft: me.timeLeft - distances[me.id][nextId] }, ele, decisions + ',' + nextId) };
            const eleOut = { id: nextId, realized: (valves[ele.id].rate * ele.timeLeft), children: makeDecision(me, { id: nextId, timeLeft: ele.timeLeft - distances[ele.id][nextId] }, decisions + ',' + nextId) };
            maxOut.push(meOut, eleOut);
        }
        else if (me.timeLeft > ele.timeLeft) {
            // console.log('m')
            const meOut = { realized: (valves[me.id].rate * me.timeLeft), children: makeDecision({ id: nextId, timeLeft: me.timeLeft - distances[me.id][nextId] }, ele, decisions + ',' + nextId) };
            maxOut.push(meOut);
        }
        else if (ele.timeLeft > me.timeLeft) {
            // console.log('e');
            const eleOut = { id: nextId, realized: (valves[ele.id].rate * ele.timeLeft), children: makeDecision(me, { id: nextId, timeLeft: ele.timeLeft - distances[ele.id][nextId] }, decisions + ',' + nextId) };
            maxOut.push(eleOut);
        }
        else {
            throw new Error();
        }
    }
    if (maxOut.length > 0) {
        maxOut.sort((a, b) => (b.children + b.realized) - (a.children + a.realized));
        // console.log(decisions, '+', maxOut[0].id, maxOut[0].realized, maxOut[0].timeLeft);
        totalRate += maxOut[0].children + maxOut[0].realized;
    }
    if (maxOut.length === 0) {
        throw new Error();
    }
    return totalRate;
};
const r = makeDecision({ id: 'AA', timeLeft: 26 }, { id: 'AA', timeLeft: 26 }, 'AA');
console.log(r);
//# sourceMappingURL=index.js.map
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
const DECRYPTION_KEY = 811589153;
const inputFile = process.argv[2];
const rawData = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data = rawData.split('\n').map(Number);
const order = rawData.split('\n').map((n) => +n * DECRYPTION_KEY);
const list = {};
let first;
let prev;
let zero;
for (let i = 0; i < data.length; i++) {
    const num = data[i] * DECRYPTION_KEY;
    const id = `${i}_${num}`;
    if (i === 0) {
        list[id] = {
            id,
            prev: null,
            value: num,
            next: null,
        };
        first = list[id];
    }
    else {
        list[id] = {
            id,
            prev: prev.id,
            value: num,
            next: null,
        };
        prev.next = id;
    }
    if (num === 0) {
        zero = list[id];
    }
    prev = list[id];
    if (i === data.length - 1) {
        list[id].next = first.id;
        first.prev = id;
    }
}
const getArray = (start) => {
    let next = start;
    const values = [];
    for (let i = 0; i < Object.keys(list).length; i++) {
        values.push(list[next].value);
        next = list[next].next;
    }
    return values;
};
const print = () => {
    console.log(JSON.stringify(getArray(zero.id).map(n => n / DECRYPTION_KEY)));
};
const removeNode = (key) => {
    const currNext = list[key].next;
    const currPrev = list[key].prev;
    list[currPrev].next = currNext;
    list[currNext].prev = currPrev;
};
const mix = () => {
    for (let i = 0; i < order.length; i++) {
        const shift = order[i];
        const key = `${i}_${shift}`;
        const smallShift = shift % (order.length - 1);
        if (smallShift % order.length === 0) {
            continue;
        }
        removeNode(key);
        let target;
        if (smallShift > 0) {
            target = key;
            for (let j = 0; j < smallShift; j++) {
                target = list[target].next;
            }
        }
        else if (smallShift < 0) {
            target = list[key].prev;
            for (let j = 0; j < Math.abs(smallShift); j++) {
                target = list[target].prev;
            }
        }
        else {
            // do not move 0; shouldn't even be possible to reach here
        }
        if (target == null) {
            throw new Error("Bad state");
        }
        const next = list[target].next;
        list[target].next = key;
        list[next].prev = key;
        list[key].next = next;
        list[key].prev = target;
        // console.log({key, target});
        // print();
        // console.log('\n')
        // break;
    }
};
for (let i = 0; i < 10; i++) {
    console.log('Mixing', i);
    mix();
}
// print();
const ar = getArray(zero.id);
// console.log(JSON.stringify(ar));
const one = ar[1000 % ar.length];
const two = ar[2000 % ar.length];
const three = ar[3000 % ar.length];
console.log({ one, two, three });
console.log(one + two + three);
//# sourceMappingURL=index.js.map
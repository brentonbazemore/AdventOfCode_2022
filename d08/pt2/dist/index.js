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
const data = rawData.split('\n').map(r => r.split('').map(Number));
const scanUp = (pos, tree) => {
    let treesViewable = 0;
    for (let i = pos.y - 1; i >= 0; i--) {
        const scannedTree = data[i][pos.x];
        treesViewable++;
        if (scannedTree >= tree) {
            return treesViewable;
        }
    }
    return treesViewable;
};
const scanDown = (pos, tree) => {
    let treesViewable = 0;
    for (let i = pos.y + 1; i < data[0].length; i++) {
        const scannedTree = data[i][pos.x];
        treesViewable++;
        if (scannedTree >= tree) {
            return treesViewable;
        }
    }
    return treesViewable;
};
const scanRight = (pos, tree) => {
    let treesViewable = 0;
    for (let i = pos.x + 1; i < data[0].length; i++) {
        const scannedTree = data[pos.y][i];
        treesViewable++;
        if (scannedTree >= tree) {
            return treesViewable;
        }
    }
    return treesViewable;
};
const scanLeft = (pos, tree) => {
    let treesViewable = 0;
    for (let i = pos.x - 1; i >= 0; i--) {
        const scannedTree = data[pos.y][i];
        treesViewable++;
        if (scannedTree >= tree) {
            return treesViewable;
        }
    }
    return treesViewable;
};
const views = [];
for (let y = 1; y < data.length - 1; y++) {
    const row = data[y];
    for (let x = 1; x < row.length - 1; x++) {
        const tree = row[x];
        views.push(scanUp({ x, y }, tree) * scanDown({ x, y }, tree) * scanRight({ x, y }, tree) * scanLeft({ x, y }, tree));
    }
}
console.log(Math.max(...views));
//# sourceMappingURL=index.js.map
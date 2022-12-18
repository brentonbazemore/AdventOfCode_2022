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
// build out the object, then find the surface area visible from each of the six sides
// on second thought, maybe just keep track of exposed surface until while adding
var Axes;
(function (Axes) {
    Axes[Axes["UP"] = 0] = "UP";
    Axes[Axes["DOWN"] = 1] = "DOWN";
    Axes[Axes["LEFT"] = 2] = "LEFT";
    Axes[Axes["RIGHT"] = 3] = "RIGHT";
    Axes[Axes["FRONT"] = 4] = "FRONT";
    Axes[Axes["BACK"] = 5] = "BACK";
})(Axes || (Axes = {}));
const lava = {};
data.forEach(coord => {
    const [x, y, z] = coord.split(',').map(Number);
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
const surfaceArea = Object.values(lava).reduce((prev, curr) => prev + curr, 0);
console.log(surfaceArea);
//# sourceMappingURL=index.js.map
import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

// build out the object, then find the surface area visible from each of the six sides
// on second thought, maybe just keep track of exposed surface until while adding
enum Axes {
  UP, // max Y
  DOWN, // min Y
  LEFT, // min X
  RIGHT, // max X
  FRONT, // max Z
  BACK, // min Z
}

type Voxel = { x: number, y: number, z: number };
const lava: {[coord: string]: number } = {};

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
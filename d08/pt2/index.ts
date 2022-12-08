import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: number[][] = rawData.split('\n').map(r => r.split('').map(Number));

const scanUp = (pos: { x: number, y: number }, tree: number) => {
  for (let i = pos.y - 1; i >= 0; i--) {
    const scannedTree = data[i][pos.x];
    if (scannedTree >= tree) {
      return false;
    }
  }
  
  // console.log(pos, 'is visible from top');
  return true;
}

const scanDown = (pos: { x: number, y: number }, tree: number) => {
  for (let i = pos.y + 1; i < data[0].length; i++) {
    const scannedTree = data[i][pos.x];
    if (scannedTree >= tree) {
      // console.log(pos, 'is visible from down');
      return false;
    }
  }

  return true;
}

const scanRight = (pos: { x: number, y: number }, tree: number) => {
  for (let i = pos.x + 1; i < data[0].length; i++) {
    const scannedTree = data[pos.y][i];
    if (scannedTree >= tree) {
      // console.log(pos, 'is visible from right');
      return false;
    }
  }

  return true;
}

const scanLeft = (pos: { x: number, y: number }, tree: number) => {
  for (let i = pos.x - 1; i >= 0; i--) {
    const scannedTree = data[pos.y][i];
    if (scannedTree >= tree) {
      // console.log(pos, 'is visible from left');
      return false;
    }
  }

  return true;
}

let total = 0;
for (let y = 1; y < data.length - 1; y++) {
  const row = data[y];
  for (let x = 1; x < row.length - 1; x++) {
    const tree = row[x];
    if (scanUp({ x, y }, tree) 
      || scanDown({ x, y }, tree)
      || scanLeft({ x, y }, tree)
      || scanRight({ x, y }, tree)) {
          total++;
        // console.log({ x, y });
      }
  }
}

console.log(total + (data.length * 2) + (data.length * 2) - 4);
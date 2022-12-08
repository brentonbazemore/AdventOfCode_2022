import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: number[][] = rawData.split('\n').map(r => r.split('').map(Number));

const scanUp = (pos: { x: number, y: number }, tree: number) => {
  let treesViewable = 0;
  for (let i = pos.y - 1; i >= 0; i--) {
    const scannedTree = data[i][pos.x];
    treesViewable++;
    if (scannedTree >= tree) {
      return treesViewable;
    }
  }
  
  return treesViewable;
}

const scanDown = (pos: { x: number, y: number }, tree: number) => {
  let treesViewable = 0;
  for (let i = pos.y + 1; i < data[0].length; i++) {
    const scannedTree = data[i][pos.x];
    treesViewable++;
    if (scannedTree >= tree) {
      return treesViewable;
    }
  }

  return treesViewable;
}

const scanRight = (pos: { x: number, y: number }, tree: number) => {
  let treesViewable = 0;
  for (let i = pos.x + 1; i < data[0].length; i++) {
    const scannedTree = data[pos.y][i];
    treesViewable++;
    if (scannedTree >= tree) {
      return treesViewable;
    }
  }

  return treesViewable;
}

const scanLeft = (pos: { x: number, y: number }, tree: number) => {
  let treesViewable = 0;
  for (let i = pos.x - 1; i >= 0; i--) {
    const scannedTree = data[pos.y][i];
    treesViewable++;
    if (scannedTree >= tree) {
      return treesViewable;
    }
  }

  return treesViewable;
}

const views = [];
for (let y = 1; y < data.length - 1; y++) {
  const row = data[y];
  for (let x = 1; x < row.length - 1; x++) {
    const tree = row[x];
    views.push(scanUp({ x, y }, tree) * scanDown({ x, y }, tree) * scanRight({ x, y }, tree) * scanLeft({ x, y }, tree));
  }
}

console.log(Math.max(...views));
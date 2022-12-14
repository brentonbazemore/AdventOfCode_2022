import * as fs from 'fs';
import path from 'path';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

enum Tile {
  Sand = 'o',
  Rock = '#',
}

type Cave = { [key: string]: Tile };
const cave: Cave = {};
const X = 0;
const Y = 1;
const bounds = {
  minX: Infinity,
  maxX: -Infinity,
  minY: Infinity,
  maxY: -Infinity,
}

data.forEach((pathString) => {
  const lines = pathString.split(' -> ');
  for (let i = 0; i < lines.length - 1; i++) {
    const point0 = lines[i].split(',').map(Number);
    const point1 = lines[i + 1].split(',').map(Number);

    const [start, end] = [point0, point1].sort((a, b) => a[X] - b[X]).sort((a, b) => a[Y] - b[Y]);
    console.log({start, end});

    bounds.minX = Math.min(bounds.minX, start[X]);
    bounds.maxX = Math.max(bounds.maxX, end[X]);
    bounds.minY = Math.min(bounds.minY, start[Y]);
    bounds.maxY = Math.max(bounds.maxY, end[Y]);

    if (start[X] === end[X]) {
      for (let y = start[Y]; y <= end[Y]; y++) {
        cave[`${start[X]},${y}`] = Tile.Rock;
      }
    }

    if (start[Y] === end[Y]) {
      for (let x = start[X]; x <= end[X]; x++) {
        cave[`${x},${start[Y]}`] = Tile.Rock;
      }
    }
  }
});

const print = (c: Cave, buffer: number) => {
  for (let y = bounds.minY - buffer; y <= bounds.maxY + buffer; y++) {
    let row = '';
    for (let x = bounds.minX - buffer; x <= bounds.maxX + buffer; x++) {
      row += c[`${x},${y}`] ? c[`${x},${y}`] : ' ';
    }
    console.log(row);
  }
}

const sandStart: [number, number] = [500, 0];
const tick = (sand: [number, number]): { sand: [number, number], direction: 'down' | 'diagonal' | 'none' } => {
  if (cave[`${sand[X]},${sand[Y] + 1}`] === undefined) {
    return { sand: [sand[X], sand[Y] + 1], direction: 'down' };
  } else if (cave[`${sand[X] - 1},${sand[Y] + 1}`] === undefined) {
    return { sand: [sand[X] - 1, sand[Y] + 1], direction: 'diagonal' };
  } else if (cave[`${sand[X] + 1},${sand[Y] + 1}`] === undefined) {
    return { sand: [sand[X] + 1, sand[Y] + 1], direction: 'diagonal' };
  }
  
  return { sand: [sand[X], sand[Y]], direction: 'none' };
};

let abyssal = false;
let sandCount = 0;
while (!abyssal) {
  sandCount++;
  let freeFallCount = 0;
  let moving = true;
  let sand: [number, number] = [...sandStart];

  while (moving) {
    const { sand: nextSand, direction } = tick(sand);
    if (nextSand[Y] === sand[Y]) {
      moving = false;
    }

    if (direction === 'down') {
      freeFallCount++;
    } else {
      freeFallCount = 0;
    }

    if (freeFallCount > 200) {
      abyssal = true;
      moving = false;
    }

    // console.log({ nextSand, moving, freeFallCount, abyssal });
  
    sand = nextSand;
  }

  cave[`${sand[X]},${sand[Y]}`] = Tile.Sand;
  // print(cave, 1);
}

console.log(sandCount - 1);
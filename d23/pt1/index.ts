import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

enum Tile {
  Elf = '#',
  Empty = '.',
}

const bounds = {
  minX: Infinity,
  maxX: -Infinity,
  minY: Infinity,
  maxY: -Infinity,
};

const updateBounds = (x: number, y: number) => {
  bounds.minX = Math.min(bounds.minX, x);
  bounds.maxX = Math.max(bounds.maxX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxY = Math.max(bounds.maxY, y);
}

const field: { [coords: string]: Tile } = {};
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[y].length; x++) {
    if (data[y][x] === Tile.Elf) {
      field[`${x},${y}`] = data[y][x] as Tile;
      updateBounds(x, y);
    }
  }
}

const print = () => {
  for (let y = bounds.minY; y <= bounds.maxY; y++) {
    let row = '';
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      row += (field[`${x},${y}`] === Tile.Elf ? '#' : ' ');
    }
    console.log(row);
  }
}

// console.log(bounds);
// print();

const getAvailability = (x: number, y: number) => {
  // a position is elf'd if false
  return {
    N: field[`${x},${y - 1}`] !== Tile.Elf,
    NE: field[`${x + 1},${y - 1}`] !== Tile.Elf,
    E: field[`${x + 1},${y}`] !== Tile.Elf,
    SE: field[`${x + 1},${y + 1}`] !== Tile.Elf,
    S: field[`${x},${y + 1}`] !== Tile.Elf,
    SW: field[`${x - 1},${y + 1}`] !== Tile.Elf,
    W: field[`${x - 1},${y}`] !== Tile.Elf,
    NW: field[`${x - 1},${y - 1}`] !== Tile.Elf,
  }
}

const directionOrder = [
  (x: number, y: number) => {
    // 'north', 
    const { N, NE, NW } = getAvailability(x, y);
    return {
      isValid: N && NE && NW,
      next: `${x},${y - 1}`,
    }
  },
  (x: number, y: number) => {
    // 'south', 
    const { S, SE, SW } = getAvailability(x, y);
    return {
      isValid: S && SE && SW,
      next: `${x},${y + 1}`,
    }
  },
  (x: number, y: number) => {
    // 'west', 
    const { W, NW, SW } = getAvailability(x, y);
    return {
      isValid: W && NW && SW,
      next: `${x - 1},${y}`,
    }
  }, 
  (x: number, y: number) => {
    // 'east'
    const { E, NE, SE } = getAvailability(x, y);
    return {
      isValid: E && NE && SE,
      next: `${x + 1},${y}`,
    }
  }, 
];

const directions = ['north', 'south', 'west', 'east'];

const totalRounds = 10;
for (let i = 0; i < totalRounds; i++) {
  const proposals: { [coords: string]: string[] } = {}
  Object.keys(field).forEach(elf => {
    const [ x, y ] = elf.split(',').map(Number);
    const { N, NE, E, SE, S, SW, W, NW } = getAvailability(x, y);
    if (N && NE && E && SE && S && SW && W && NW) {
      // do nothing if nobody is around
      return;
    }

    let proposed;
    for (let j = 0; j < directionOrder.length; j++) {
      const nthDirection = (j + i) % directionOrder.length;
      const d = directionOrder[nthDirection](x, y);
      if (d.isValid) {
        proposed = d.next;
        break;
      }
    }

    if (proposed != null) {
      if (proposals[proposed] != null) {
        proposals[proposed].push(elf);
      } else {
        proposals[proposed] = [elf];
      }
    }
  });

  Object.keys(proposals).forEach(proposedCoord => {
    if (proposals[proposedCoord].length === 1) {
      const [x, y] = proposedCoord.split(',').map(Number);
      updateBounds(x, y);
      const currentCoord = proposals[proposedCoord][0];
      delete field[currentCoord];
      field[proposedCoord] = Tile.Elf;
    } else {
      // do nothing?
    }
  });

  console.log('End Round', i);
  // print();
}

const getBounds = () => {
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  };

  Object.keys(field).forEach(coord => {
    const [ x, y ] = coord.split(',').map(Number);
    bounds.minX = Math.min(bounds.minX, x);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxY = Math.max(bounds.maxY, y);
  });

  return bounds;
}

const { maxX, minX, maxY, minY } = getBounds();
// for (let y = finalBounds.minY; y < finalBounds.maxY; y++) {
//   for (let x = finalBounds.minX; x < finalBounds.maxX; x++) {
//     if ()
//   }
// }

const width = (maxX - minX) + 1;
const height = (maxY - minY) + 1;
console.log((width * height) - Object.keys(field).length);
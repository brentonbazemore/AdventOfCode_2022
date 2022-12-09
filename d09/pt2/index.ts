import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

type Coords = { x: number, y: number };
let head = { x: 0, y: 0 };
let tail = { x: 0, y: 0 };

const checkAdjacency = (a: Coords, b: Coords) => {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (a.x + i === b.x && a.y + j == b.y) { 
        return true;
      }
    }
  }

  return false;
}

const coords2key = (coords: Coords) => {
  return `${coords.x}_${coords.y}`;
}
const visited: {[key: string]: boolean } = {};

const moveTail = () => {
  if (!checkAdjacency(head, tail)) {
    if (head.x !== tail.x) {
      tail.x += Math.sign(head.x - tail.x);
    }

    if (head.y !== tail.y) {
      tail.y += Math.sign(head.y - tail.y);
    }
  }
}

const move = {
  U: () => {
    head.y++;
    moveTail();
  },
  D: () => {
    head.y--;
    moveTail();
  },
  R: () => {
    head.x++;
    moveTail();
  },
  L: () => {
    head.x--;
    moveTail();
  },
};

data.forEach((rawMove) => {
  const [d, a] = rawMove.split(' ');
  const direction: 'U' | 'D' | 'L' | 'R' = d as (any);
  const amount = +a;

  console.log({direction, amount});
  for (let i = 0; i < amount; i++) {
    move[direction]();
    console.log('movin', { head, tail });
    visited[coords2key(tail)] = true;
  }
});

console.log(Object.values(visited).length);

console.log('final', { head, tail });
// console.log(checkAdjacency(head, { x: 0, y: 0 }));

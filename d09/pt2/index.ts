import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

type Coords = { x: number, y: number };

const knots: Coords[] = [];
for (let i = 0; i < 10; i++) {
  knots.push({ x: 0, y: 0 });
}

const checkAdjacency = (head: Coords, tail: Coords) => {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (head.x + i === tail.x && head.y + j == tail.y) { 
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

const moveTail = (head: Coords, tail: Coords) => {
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
  U: (head: Coords) => {
    head.y++;
  },
  D: (head: Coords) => {
    head.y--;
  },
  R: (head: Coords) => {
    head.x++;
  },
  L: (head: Coords) => {
    head.x--;
  },
};

data.forEach((rawMove) => {
  const [d, a] = rawMove.split(' ');
  const direction: 'U' | 'D' | 'L' | 'R' = d as (any);
  const amount = +a;

  for (let i = 0; i < amount; i++) {
    move[direction](knots[0]);
    for (let k = 0; k < knots.length - 1; k++) {
      const head = knots[k];
      const tail = knots[k + 1];
      moveTail(head, tail);
    }
    visited[coords2key(knots[9])] = true;

  }
});

console.log(Object.values(visited).length);

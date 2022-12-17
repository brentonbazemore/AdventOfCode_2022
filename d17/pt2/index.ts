import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('');

class Shape {
  bounds = {
    maxX: 6,
    minX: 0
  }
  raw: string[];
  height: number;
  width: number;
  position: { x: number, y: number };
  private pointMapCache: string[] | null = null;

  constructor(rawShape: string, startingY: number) {
    this.raw = rawShape.split('\n').reverse();
    this.height = this.raw.length;
    this.width = this.raw[0].length;
    // bottom left coord of the bounding square
    this.position = { x: 2, y: startingY };
  }

  moveLeft(filledPoints: Set<string>) {
    this.position.x--;
    this.pointMapCache = null;
    if (this.detectCollision(filledPoints)) {
      this.pointMapCache = null;
      this.position.x++;
    }
  }

  moveRight(filledPoints: Set<string>) {
    this.position.x++;
    this.pointMapCache = null;
    if (this.detectCollision(filledPoints)) {
      this.pointMapCache = null;
      this.position.x--;
    }
  }

  // returns if did move
  moveDown(filledPoints: Set<string>): boolean {
    this.position.y--;
    this.pointMapCache = null;
    if (this.detectCollision(filledPoints)) {
      this.pointMapCache = null;
      this.position.y++;
      return false;
    }

    return true;
  }

  detectCollision(filledPoints: Set<string>) {
    const thisPoints = this.getPointMap();
    for (let i = 0; i < thisPoints.length; i++) {
      if (filledPoints.has(thisPoints[i])) {
        return true;
      }
    }

    return false;
  }

  getPointMap() {
    if (this.pointMapCache) {
      return this.pointMapCache;
    }

    const points = [];
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.raw[i][j] === '#') {
          points.push(`${this.position.x + j}_${this.position.y + i}`);
        }
      }
    }

    this.pointMapCache = points;

    return points;
  }
}

const shapes = [
`####`,
`.#.
###
.#.`,
`..#
..#
###`,
`#
#
#
#`,
`##
##`
];

const filledPoints = new Set<string>([
  '0_-1',
  '1_-1',
  '2_-1',
  '3_-1',
  '4_-1',
  '5_-1',
  '6_-1',
]);

const print = (shape: Shape) => {
  const rows: string[][] = [];
  for (let i = spawnHeight; i >= -1; i--) {
    let row = [];
    for (let j = -1; j < 8; j++) {
      if (shape.getPointMap().includes(`${j}_${i}`)) {
        row.push('@');
      } else if (filledPoints.has(`${j}_${i}`)) {
        row.push('#');
      } else {
        row.push('.');
      }
    }
    rows.push(row)
  }

  rows.forEach(r => console.log(r.join('')));

  console.log('\n\n');
}

const lockInPoints = (shape: Shape) => {
  const points = shape.getPointMap();
  points.forEach(point => filledPoints.add(point));
}

let spawnHeight = 3;
const spawnCount = 2022;
let jetPointer = 0;
for (let i = 0; i < spawnCount; i++) {
  const shape = new Shape(shapes[i % shapes.length], spawnHeight)
  for (let i = 3; i >= 0; i--) {
    filledPoints.add(`-1_${spawnHeight - i}`);
    filledPoints.add(`7_${spawnHeight - i}`);
  }

  let didMoveDown = true;
  while (didMoveDown) {
    const direction = data[jetPointer % data.length];
    // console.log(direction);
    if (direction === '>') {
      shape.moveRight(filledPoints);
    } else {
      shape.moveLeft(filledPoints);
    }

    // print(shape);
    jetPointer++;
    didMoveDown = shape.moveDown(filledPoints);
    // console.log('V')
    // print(shape);
  }

  lockInPoints(shape);
  spawnHeight = Math.max(spawnHeight, shape.position.y + shape.height + 3);
}

console.log(spawnHeight - 3);
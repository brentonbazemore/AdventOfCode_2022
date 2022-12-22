import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const [rawBoardData, instructionData]: string[] = rawData.split('\n\n');
const boardData = rawBoardData.split('\n');
enum Tile {
  Open = '.',
  Wall = '#',
  OOB = ' ', // out of bounds
}

let boardWidth = 0;
const boardHeight = boardData.length;
for (let i = 0; i < boardData.length; i++) {
  boardWidth = Math.max(boardWidth, boardData[i].length);
}

let start: Coords = null as unknown as Coords;
const normalizedBoard: {[coords: string]: Tile } = {};
for (let y = 0; y < boardData.length; y++) {
  const row = boardData[y];
  for (let x = 0; x < boardWidth; x++) {
    if (y === 0 && start == null && row[x] == Tile.Open) {
      start = { x, y };
    }

    if (row[x] == undefined) {
      normalizedBoard[`${x},${y}`] = Tile.OOB;
    } else {
      normalizedBoard[`${x},${y}`] = row[x] as Tile;
    }
  }
}

class TileNode {
  up!: string; // ignore that these aren't defined in constructor because I'll force a call to init on a second pass
  down!: string;
  left!: string;
  right!: string;
  tile: Tile;
  x: number;
  y: number;

  constructor(x: number, y: number, tile: Tile) {
    this.tile = tile;
    this.x = x;
    this.y = y;
  }

  link(tiles: { [key: string]: TileNode }) {
    let upY = this.y - 1;
    while (true) {
      if (upY < 0) {
        upY = boardHeight - 1;
      }

      if (tiles[`${this.x},${upY}`] != undefined) {
        this.up = `${this.x},${upY}`;
        break;
      }

      upY--;
    }

    let downY = this.y + 1;
    while (true) {
      if (downY >= boardHeight) { // TODO: verify off by one
        downY = 0;
      }

      if (tiles[`${this.x},${downY}`] != undefined) {
        this.down = `${this.x},${downY}`;
        break;
      }

      downY++;
    }

    let rightX = this.x + 1;
    while (true) {
      if (rightX >= boardWidth) {
        rightX = 0;
      }

      if (tiles[`${rightX},${this.y}`] != undefined) {
        this.right = `${rightX},${this.y}`;
        break;
      }

      rightX++;
    }

    let leftX = this.x - 1;
    while (true) {
      if (leftX < 0) {
        leftX = boardWidth - 1;
      }

      if (tiles[`${leftX},${this.y}`] != undefined) {
        this.left = `${leftX},${this.y}`;
        break;
      }

      leftX--;
    }
  }
}

const boardTiles: { [key: string]: TileNode } = {};
for (let y = 0; y < boardHeight; y++) {
  for (let x = 0; x < boardWidth; x++) {
    const coord = `${x},${y}`;
    if (normalizedBoard[coord] !== Tile.OOB) {
      boardTiles[coord] = new TileNode(x, y, normalizedBoard[coord]);
    }
  }
}

for (let y = 0; y < boardHeight; y++) {
  for (let x = 0; x < boardWidth; x++) {
    const coord = `${x},${y}`;
    if (boardTiles[coord] != undefined) {
      boardTiles[coord].link(boardTiles);
    }
  }
}
type MoveInstruction = {
  type: 'move';
  value: number;
}
type TurnInstruction = {
  type: 'turn';
  value: string;
}
type Instruction = MoveInstruction | TurnInstruction;
const rawInstructions = instructionData.split('');
const instructions: Instruction[] = [];
let nextJob: 'number' | 'letter' = 'number';
while (rawInstructions.length > 0) {
  if (nextJob === 'number') {
    const digits = [];
    for (let i = 0; i < 4; i++) {
      if (rawInstructions[0] === 'L' || rawInstructions[0] === 'R') {
        break;
      }
      digits.push(rawInstructions.shift());
    }

    instructions.push({ type: 'move', value: +digits.join('') });
    nextJob = 'letter';
  } else if (nextJob === 'letter') {
    instructions.push({ type: 'turn', value: rawInstructions.shift()! });
    nextJob = 'number';
  }
}

type Coords = { x: number, y: number };
enum Direction {
  R = 0,
  D = 1,
  L = 2,
  U = 3,
}

let position: Coords = start;
let direction = Direction.R;

const move = (inst: MoveInstruction) => {
  let nextTile = boardTiles[`${position.x},${position.y}`];
  if (direction === Direction.R) {
    for (let i = 0; i < inst.value; i++) {
      const peakTile = boardTiles[nextTile.right];
      if (peakTile.tile === Tile.Wall) {
        // return nextTile;
        break;
      }

      nextTile = peakTile;
    }
  } else if (direction === Direction.L) {
    for (let i = 0; i < inst.value; i++) {
      const peakTile = boardTiles[nextTile.left];
      if (peakTile.tile === Tile.Wall) {
        // return nextTile;
        break;
      }

      nextTile = peakTile;
    }
  } else if (direction === Direction.U) {
    for (let i = 0; i < inst.value; i++) {
      const peakTile = boardTiles[nextTile.up];
      if (peakTile.tile === Tile.Wall) {
        // return nextTile;
        break;
      }

      nextTile = peakTile;
    }
  } else if (direction === Direction.D) {
    for (let i = 0; i < inst.value; i++) {
      const peakTile = boardTiles[nextTile.down];
      if (peakTile.tile === Tile.Wall) {
        // return nextTile;
        break;
      }

      nextTile = peakTile;
    }
  } else {
    throw new Error('invalid move');
  }

  position = {x: nextTile.x, y: nextTile.y };
}

const leftTurn = {
  [Direction.U]: Direction.L,
  [Direction.L]: Direction.D,
  [Direction.D]: Direction.R,
  [Direction.R]: Direction.U,
}

const rightTurn = {
  [Direction.U]: Direction.R,
  [Direction.R]: Direction.D,
  [Direction.D]: Direction.L,
  [Direction.L]: Direction.U,
}
const turn = (inst: TurnInstruction) => {
  if (inst.value === 'L') {
    direction = leftTurn[direction];
  } else if (inst.value === 'R') {
    direction = rightTurn[direction];
  } else {
    throw new Error('invalid turn');
  }
}

const instMap = {
  'move': move,
  'turn': turn,
}

for (let i = 0; i < instructions.length; i++) {
  const instruction = instructions[i];
  instMap[instruction.type](instruction as any);
  // console.log(position, Direction[direction]);
}

console.log(((position.y + 1) * 1000) + ((position.x + 1) * 4) + direction);

// console.log(boardTiles);

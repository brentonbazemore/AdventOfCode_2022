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

let start: Coords3D = { x: 0, y: 0, f: 1 };
const normalizedBoard: {[coords: string]: Tile } = {};
for (let y = 0; y < boardData.length; y++) {
  const row = boardData[y];
  for (let x = 0; x < boardWidth; x++) {
    if (row[x] == undefined) {
      normalizedBoard[`${x},${y}`] = Tile.OOB;
    } else {
      normalizedBoard[`${x},${y}`] = row[x] as Tile;
    }
  }
}

type FaceTransform = { id: number, rotation: number };
type Face = {
  id: number,
  zeroZero: Coords2D,
  board: { [coords2D: string]: TileNode },
  up: FaceTransform,
  right: FaceTransform,
  down: FaceTransform,
  left: FaceTransform,
}

// Uncomment for test input
// const faceDimensions = 4;
// const faces: { [id: number]: Face } = {
//   1: {
//     id: 1,
//     zeroZero: { x: 8, y: 0 },
//     board: {},
//     up: { id: 2, rotation: 2 },
//     right: { id: 6, rotation: 2 },
//     down: { id: 4, rotation: 0 },
//     left: { id: 3, rotation: 1 },
//   },
//   2: {
//     id: 2,
//     zeroZero: { x: 0, y: 4 },
//     board: {},
//     up: { id: 1, rotation: 2 },
//     right: { id: 3, rotation: 0 },
//     down: { id: 5, rotation: 2 },
//     left: { id: 6, rotation: -1 },
//   },
//   3: {
//     id: 3,
//     zeroZero: { x: 4, y: 4 },
//     board: {},
//     up: { id: 1, rotation: -1 },
//     right: { id: 4, rotation: 0 },
//     down: { id: 5, rotation: 1 },
//     left: { id: 2, rotation: 0 },
//   },
//   4: {
//     id: 4,
//     zeroZero: { x: 8, y: 4 },
//     board: {},
//     up: { id: 1, rotation: 0 },
//     right: { id: 6, rotation: -1 },
//     down: { id: 5, rotation: 0 },
//     left: { id: 3, rotation: 0 },
//   }, 
//   5: {
//     id: 5,
//     zeroZero: { x: 8, y: 8 },
//     board: {},
//     up: { id: 5, rotation: 0 },
//     right: { id: 6, rotation: 0 },
//     down: { id: 2, rotation: 2 },
//     left: { id: 3, rotation: -1 },
//   },
//   6: {
//     id: 6,
//     zeroZero: { x: 12, y: 8 },
//     board: {},
//     up: { id: 4, rotation: 1 },
//     right: { id: 1, rotation: 2 },
//     down: { id: 2, rotation: 1 },
//     left: { id: 5, rotation: 0 },
//   }
// }

const faceDimensions = 50;
const faces: { [id: number]: Face } = { // hardcoded because it's just easier
  1: {
    id: 1,
    zeroZero: { x: 50, y: 0 },
    board: {},
    up: { id: 6, rotation: -1 },
    right: { id: 2, rotation: 0 },
    down: { id: 3, rotation: 0 },
    left: { id: 4, rotation: 2 },
  },
  2: {
    id: 2,
    zeroZero: { x: 100, y: 0 },
    board: {},
    up: { id: 6, rotation: 0 },
    right: { id: 5, rotation: 2 },
    down: { id: 3, rotation: -1 },
    left: { id: 1, rotation: 0 },
  },
  3: {
    id: 3,
    zeroZero: { x: 50, y: 50 },
    board: {},
    up: { id: 1, rotation: 0 },
    right: { id: 2, rotation: 1 },
    down: { id: 5, rotation: 0 },
    left: { id: 4, rotation: 1 },
  },
  4: {
    id: 4,
    zeroZero: { x: 0, y: 100 },
    board: {},
    up: { id: 3, rotation: -1 },
    right: { id: 5, rotation: 0 },
    down: { id: 6, rotation: 0 },
    left: { id: 1, rotation: 2 },
  }, 
  5: {
    id: 5,
    zeroZero: { x: 50, y: 100 },
    board: {},
    up: { id: 3, rotation: 0 },
    right: { id: 2, rotation: 2 },
    down: { id: 6, rotation: -1 },
    left: { id: 4, rotation: 0 },
  },
  6: {
    id: 6,
    zeroZero: { x: 0, y: 150 },
    board: {},
    up: { id: 4, rotation: 0 },
    right: { id: 5, rotation: 1 },
    down: { id: 2, rotation: 0 },
    left: { id: 1, rotation: 1 },
  }
}

const rotate90 = ({ x, y }: { x: number, y: number }, size: number) => {
  return { x: y, y: size - x - 1 };
}

const rotate180 = (coord: { x: number, y: number }, size: number) => {
  return rotate90(rotate90(coord, size), size);
}

const rotate270 = (coord: { x: number, y: number }, size: number) => {
  return rotate90(rotate90(rotate90(coord, size), size), size);
}

class TileNode {
  up!: string; // ignore that these aren't defined in constructor because I'll force a call to init on a second pass
  down!: string;
  left!: string;
  right!: string;
  tile: Tile;
  face: number;
  x: number;
  y: number;

  constructor(x: number, y: number, tile: Tile, face: number) {
    this.tile = tile;
    this.x = x;
    this.y = y;
    this.face = face;
  }

  rotate(coord: {x: number, y: number}, rotation: number) {
    if (rotation === 0) {
      return coord;
    } else if (rotation === 1) {
      return rotate90(coord, faceDimensions);
    } else if (rotation === 2) {
      return rotate180(coord, faceDimensions);
    } else if (rotation === -1) {
      return rotate270(coord, faceDimensions);
    } else {
      throw new Error('invalid rotate');
    }
  }

  link(faces: { [id: number]: Face }) {
    let upY = this.y - 1;
    let upFace = this.face;
    let upRotation = 0;
    if (upY < 0) {
      upFace = faces[this.face].up.id;
      upRotation = faces[this.face].up.rotation;
      upY = faceDimensions - 1;
    }
    const upXY = this.rotate({ x: this.x, y: upY }, upRotation);
    this.up = `${upXY.x},${upXY.y},${upFace},${upRotation}`;

    let downY = this.y + 1;
    let downFace = this.face;
    let downRotation = 0;
    if (downY >= faceDimensions) {
      downFace = faces[this.face].down.id;
      downRotation = faces[this.face].down.rotation;
      downY = 0;
    }
    const downXY = this.rotate({ x: this.x, y: downY }, downRotation);
    this.down = `${downXY.x},${downXY.y},${downFace},${downRotation}`;

    let rightX = this.x + 1;
    let rightFace = this.face;
    let rightRotation = 0;
    if (rightX >= faceDimensions) {
      rightFace = faces[this.face].right.id;
      rightRotation = faces[this.face].right.rotation;
      rightX = 0;
    }
    const rightXY = this.rotate({ x: rightX, y: this.y }, rightRotation);
    this.right = `${rightXY.x},${rightXY.y},${rightFace},${rightRotation}`;

    let leftX = this.x - 1;
    let leftFace = this.face;
    let leftRotation = 0;
    if (leftX < 0) {
      leftFace = faces[this.face].left.id;
      leftRotation = faces[this.face].left.rotation;
      leftX = faceDimensions - 1;
    }
    const leftXY = this.rotate({ x: leftX, y: this.y }, leftRotation);
    this.left = `${leftXY.x},${leftXY.y},${leftFace},${leftRotation}`;
  }
}

Object.values(faces).forEach(face => {
  const faceBoard: { [coords: string]: TileNode} = {};
  for (let y = 0; y < faceDimensions; y++) {
    const faceY = y + face.zeroZero.y;
    for (let x = 0; x < faceDimensions; x++) {
      const faceX = x + face.zeroZero.x;
      faceBoard[`${x},${y}`] = new TileNode(x, y, normalizedBoard[`${faceX},${faceY}`], face.id);
    }
  }

  face.board = faceBoard;
});

Object.values(faces).forEach(face => {
  const faceBoard = face.board;
  for (let y = 0; y < faceDimensions; y++) {
    for (let x = 0; x < faceDimensions; x++) {
      faceBoard[`${x},${y}`].link(faces)
    }
  }

  face.board = faceBoard;
});

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

type Coords2D = { x: number, y: number };
type Coords3D = { x: number, y: number, f: number };
enum Direction {
  R = 0,
  D = 1,
  L = 2,
  U = 3,
}

let position: Coords3D = start;
let direction = Direction.R;

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

const handleRotation = (rotations: number) => {
  if (rotations === -1) {
    turn({ type: 'turn', value: 'R' });
  } else if (rotations === 2) {
    turn({ type: 'turn', value: 'R' });
    turn({ type: 'turn', value: 'R' });
  } else if (rotations === 1) {
    turn({ type: 'turn', value: 'L' });
  }
}

const move = (inst: MoveInstruction) => {
  let face = position.f;
  let faceBoard = faces[face].board;
  let nextTile = faceBoard[`${position.x},${position.y}`];
  for (let i = 0; i < inst.value; i++) {
    if (direction === Direction.R) {
      const [ x, y, f, r ] = nextTile.right.split(',').map(Number);
      const peakBoard = faces[f].board;
      const peakTile = peakBoard[`${x},${y}`];

      if (peakTile.tile === Tile.Wall) {
        break;
      }

      if (face !== f) {
        face = f;
        faceBoard = faces[face].board;
        handleRotation(r);
      }

      nextTile = peakTile;
    } else if (direction === Direction.L) {
      const [ x, y, f, r ] = nextTile.left.split(',').map(Number);
      const peakBoard = faces[f].board;
      const peakTile = peakBoard[`${x},${y}`];

      if (peakTile.tile === Tile.Wall) {
        break;
      }

      if (face !== f) {
        face = f;
        faceBoard = faces[face].board;
        handleRotation(r);
      }

      nextTile = peakTile;
    } else if (direction === Direction.U) {
      const [ x, y, f, r ] = nextTile.up.split(',').map(Number);
      const peakBoard = faces[f].board;
      const peakTile = peakBoard[`${x},${y}`];

      if (peakTile.tile === Tile.Wall) {
        break;
      }

      if (face !== f) {
        face = f;
        faceBoard = faces[face].board;
        handleRotation(r);
      }

      nextTile = peakTile;
    } else if (direction === Direction.D) {
      const [ x, y, f, r ] = nextTile.down.split(',').map(Number);
      const peakBoard = faces[f].board;
      const peakTile = peakBoard[`${x},${y}`];

      if (peakTile.tile === Tile.Wall) {
        break;
      }

      if (face !== f) {
        face = f;
        faceBoard = faces[face].board;
        handleRotation(r);
      }

      nextTile = peakTile;
    } else {
      throw new Error('invalid move');
    }
  } 

  position = { x: nextTile.x, y: nextTile.y, f: nextTile.face };
}

const instMap = {
  move,
  turn,
}

for (let i = 0; i < instructions.length; i++) {
  const instruction = instructions[i];
  instMap[instruction.type](instruction as any);
}

console.log(((faces[position.f].zeroZero.y + position.y + 1) * 1000) + ((faces[position.f].zeroZero.x + position.x + 1) * 4) + direction)

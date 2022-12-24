import * as fs from 'fs';
import lcm from 'lcm';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

const blizzards: { [coords: string]: string }  = {};
const bounds = {
  minX: 0,
  maxX: data[0].length - 1,
  minY: 0,
  maxY: data.length - 1,
}

const cycleWidth = (bounds.maxX - bounds.minX) + 1;
const cycleHeight = (bounds.maxY - bounds.minY) + 1;
const cycle = lcm(cycleWidth, cycleHeight);

const START = '0,-1';
const END = `${bounds.maxX},${bounds.maxY + 1}`;

for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data[0].length; j++) {
    if (['^', 'v', '<', '>'].includes(data[i][j])) {
      blizzards[`${j},${i}`] = data[i][j];
    }
  }
}

const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
}

const forecastBlizzard = (x: number, y: number, minute: number) => {
  const goingRight = blizzards[`${mod((x - minute), cycleWidth)},${y}`] === '>';
  const goingLeft = blizzards[`${mod((x + minute), cycleWidth)},${y}`] === '<';
  const goingUp = blizzards[`${x},${mod((y + minute), cycleHeight)}`] === '^';
  const goingDown = blizzards[`${x},${mod((y - minute), cycleHeight)}`] === 'v';

  return goingUp || goingDown || goingRight || goingLeft;
}

const isInBounds = (x: number, y: number) => {
  return (x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY) || `${x},${y}` === END || `${x},${y}` === START;
}

const getNeighbors = (node: { position: string, distance: number }) => {
  const [x, y] = node.position.split(',').map(Number);

  const moves = [
    { x, y: y - 1 },  // up  
    { x, y: y + 1 },  // down
    { x: x - 1, y },  // left
    { x: x + 1, y },  // right
    { x, y },         // wait
  ].filter(move => {
    return isInBounds(move.x, move.y) && !forecastBlizzard(move.x, move.y, node.distance + 1)
  }).map(move => `${move.x},${move.y}`);  
  
  return moves;
};

function bfs(start: string, target: string, startingDistance: number) {
  const queue = [{ position: start, distance: startingDistance }];
  const seen = new Set();
  seen.add(`${start}&${startingDistance}`);

  for (const node of queue) { 
    if (node.position === target) return node.distance;
    for (const neighbor of getNeighbors(node)) {
      if (seen.has(`${neighbor}&${(node.distance + 1) % cycle}`)) continue;
      seen.add(`${neighbor}&${(node.distance + 1) % cycle}`);
      queue.push({ position: neighbor, distance: node.distance + 1 });
    }
  }

  return -1;
}

let startingDistance = 0;
startingDistance = bfs(START, END, startingDistance);
startingDistance = bfs(END, START, startingDistance);
startingDistance = bfs(START, END, startingDistance);
console.log(startingDistance);

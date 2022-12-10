import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

let register = 1;

const ops = {
  'addx': {
    requiredCycles: 2,
    op: (val: number) => {
      register += val;
    }
  },
  'noop': {
    requiredCycles: 1,
    op: (val: number) => {}
  }
};

const instructions = data.map((row: string) => {
  const [rawInst, rawV] = row.split(' ');
  const inst = rawInst as 'addx' | 'noop';
  const value = +rawV;

  return { inst, value };
}).reverse();

let total = 0;
const max = 220;
let currentInst = instructions.pop()!;
let remainingCycles = ops[currentInst.inst].requiredCycles;
for (let i = 1; i < max + 1; i++) {
  if (remainingCycles === 0) {
    ops[currentInst.inst].op(currentInst.value);
    currentInst = instructions.pop()!;
    remainingCycles = ops[currentInst.inst].requiredCycles;
  }

  remainingCycles--;


  if ([20, 60, 100, 140, 180, 220].includes(i)) {
    total += (i * register);
  }
}

console.log(total)
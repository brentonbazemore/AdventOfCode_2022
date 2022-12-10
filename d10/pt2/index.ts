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

const rows: string[] = ['','','','','',''];
const max = 240;
let currentInst = instructions.pop()!;
let remainingCycles = ops[currentInst.inst].requiredCycles;
for (let i = 0; i < max; i++) {
  let currentRow = Math.floor(i / 40);
  if (remainingCycles === 0) {
    ops[currentInst.inst].op(currentInst.value);
    currentInst = instructions.pop()!;
    remainingCycles = ops[currentInst.inst].requiredCycles;
  }

  remainingCycles--;
  if ([register - 1, register, register + 1].includes(i % 40)) {
    rows[currentRow] += '#';
  } else {
    rows[currentRow] += ' ';
  }
}

console.log(rows);
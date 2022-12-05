import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const [initial, rawInstructions]: string[][] = rawData.split('\n\n').map(r => r.split('\n'));

const stacks: {[id: number]: string[]} = {};
for (let i = 0; i < initial.length - 1; i++) {
  const row = initial[i];
  let stackId = 0;
  for (let j = 1; j < row.length; j += 4) {
    stackId++;
    const crate = row[j];
    if (!stacks[stackId]) {
      stacks[stackId] = [];
    }
    if (crate === ' ') {
      continue;
    }
    stacks[stackId].push(crate);
  }
}

Object.values(stacks).map(s => s.reverse());

const instructions = rawInstructions.map(inst => {
  const [, amount, , from, ,to] = inst.split(' ').map(Number);
  return { amount, from, to }
});

instructions.forEach(inst => {
  for (let i = 0; i < inst.amount; i++) {
    stacks[inst.to].push(stacks[inst.from].pop()!);
  }
});

console.log(Object.values(stacks).map(s => s[s.length - 1]).join(''));
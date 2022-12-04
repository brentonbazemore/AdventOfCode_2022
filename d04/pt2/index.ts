import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

const out = data.filter((pair) => {
  const [left, right] = pair.split(',');
  const [l1, l2] = left.split('-').map(n => +n);
  const [r1, r2] = right.split('-').map(n => +n);

  if (l1 <= r1 && l2 >= r2) {
    return true;
  }

  if (r1 <= l1 && r2 >= l2) {
    return true;
  }
});

console.log(out.length);
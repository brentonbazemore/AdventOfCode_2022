import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string = rawData;

for (let i = 13; i < data.length; i++) {
  const chars = new Set(...[data.slice(i - 14, i)]);
  if (chars.size === 14) {
    console.log(i);
    break;
  }
}
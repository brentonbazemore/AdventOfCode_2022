import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string = rawData;

console.log(data);

for (let i = 3; i < data.length; i++) {
  const chars = new Set(...[data.slice(i - 4, i)]);
  if (chars.size === 4) {
    console.log(i, 'scuess', chars);
    break;
  }
}
import * as fs from 'fs';
import * as _ from 'lodash';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

const letters: {[key: string]: number} = {};
for (let i = 0; i < 26; i++) {
  letters[String.fromCharCode(97 + i)] = i + 1;
}
for (let i = 0; i < 26; i++) {
  letters[String.fromCharCode(65 + i)] = i + 1 + 26;
}

let total = 0;
data.forEach((ruckSack) => {
  const half = Math.ceil(ruckSack.length / 2);    
  const left = ruckSack.slice(0, half).split('');
  const right = ruckSack.slice(half, ruckSack.length).split('');

  const dupe = _.intersection(left, right)[0];
  total += letters[dupe];
})

console.log(total);
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
for (let i = 0; i < data.length; i += 3) {
  const [one, two, three] = data.slice(i, i + 3).map(a => a.split(''));
  const dupe = _.intersection(one, two, three)[0];
  total += letters[dupe];
}
console.log(total);
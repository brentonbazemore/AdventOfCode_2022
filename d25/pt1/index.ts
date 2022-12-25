import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

const charMap: any = {
  '0': 0,
  '1': 1,
  '2': 2,
  '-': -1,
  '=': -2,
}

let tot = 0;
data.forEach(rawNum => {
  let sum = 0;
  for (let i = 0; i < rawNum.length; i++) {
    sum += (charMap[rawNum[i]] * (5 ** ((rawNum.length - 1) - i)))
  }
  tot += sum;
});
console.log(tot);
const top = `${Number(tot).toString(5)}`.split('').map(d => '2');
top.push('2'); // just make it a bit bigger
console.log(top.join(''));

const chars = ['2', '1', '0', '-', '='];
let position = -1;
 
positionLoop:
while (true) {
  position++;
  for (let i = 0; i < 5; i++) {
    const candidate = [...top];
    candidate[position] = chars[i];
    console.log(candidate.join(''));
    let sum = 0;
    for (let i = 0; i < candidate.length; i++) {
      sum += (charMap[candidate[i]] * (5 ** ((candidate.length - 1) - i)));
    }

    if (sum < tot) {
      top[position] = chars[i - 1];
      continue positionLoop;
    }

    if (sum === tot) {
      console.log('Result:')
      console.log(candidate.join(''))
      break positionLoop;
    }

    if (i === 4) {
      top[position] = chars[4];
      continue positionLoop;
    }
  }
}

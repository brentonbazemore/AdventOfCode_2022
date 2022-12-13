import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n\n');

type List = number | List[];

const compare = (left: List, right: List): void => {
  console.log(JSON.stringify({ left, right }));
  if (right == undefined) {
    throw false;
  }

  if (left == undefined) {
    throw true;
  }

  if (left == undefined && right == undefined) {
    throw true; // TODO: verify
  }

  if (Number.isInteger(left) && Number.isInteger(right)) {
    if (left === right) {
      return;
    }

    throw left < right;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length === 0 && right.length > 0) {
      throw true;
    }

    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      compare(left[i], right[i]);
    }

    return;
  }

  if (Array.isArray(left) && Number.isInteger(right)) {
    return compare(left, [right]);
  }

  if (Number.isInteger(left) && Array.isArray(right)) {
    return compare([left], right);
  }

  return;
}

let total = 0;
data.forEach((pair, index) => {
  console.log('\n\nIndex', index + 1);
  const [left, right] = pair.split('\n').map(val => JSON.parse(val));

  let result;
  try {
    compare(left, right);
    result = true;
    console.log("MADE IT");
  } catch (e) {
    result = e;
  }

  console.log({result});
  if (result) {
    total += (index + 1);
  }
})

console.log(total);
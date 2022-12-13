import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
type List = number | List[];
const data: List[] = rawData.split('\n\n').flatMap(l => l.split('\n')).map(l => JSON.parse(l));
data.push(JSON.parse('[[2]]'));
data.push(JSON.parse('[[6]]'));

const compare = (left: List, right: List): void => {
  if (right == undefined) {
    throw false;
  }

  if (left == undefined) {
    throw true;
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

data.sort((left, right) => {
  let result;
  try {
    compare(left, right);
    result = true;
  } catch (e) {
    result = e;
  }

  return result ? -1 : 1;
})

const two = (data.findIndex(d => JSON.stringify(d) === '[[2]]') + 1);
const six = (data.findIndex(d => JSON.stringify(d) === '[[6]]') + 1)
console.log(two * six);
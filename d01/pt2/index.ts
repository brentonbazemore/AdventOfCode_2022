import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n\n');
console.log(data);

const summed = data.map(elf => {
  const calories = elf.split('\n');
  let sum = 0;
  for (let i = 0; i < calories.length; i++) {
    sum += +calories[i];
  }
  
  return sum;

});

console.log(Math.max(...summed));
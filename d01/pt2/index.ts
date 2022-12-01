import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n\n');

const summed = data.map(elf => {
  const calories = elf.split('\n');
  let sum = 0;
  for (let i = 0; i < calories.length; i++) {
    sum += +calories[i];
  }
  
  return sum;

});

summed.sort((a, b) => b - a);
console.log(summed[0] + summed[1] + summed[2]);
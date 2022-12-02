import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

const map: any = {
  'A': 'ROCK',
  'X': 'LOSE',
  'B': 'PAPER',
  'Y': 'DRAW',
  'C': 'SCISSORS',
  'Z': 'WIN',
}

let totalScore = 0;
const win = 6;
const draw = 3;
const lose = 0;
const rock = 1;
const paper = 2;
const scissors = 3;
data.forEach(round => {
  const [them, me] = round.split(' ');
  if (map[them] === 'ROCK' && map[me] === 'LOSE') {
    totalScore += lose + scissors;
  }
  if (map[them] === 'ROCK' && map[me] === 'DRAW') {
    totalScore += draw + rock;
  }
  if (map[them] === 'ROCK' && map[me] === 'WIN') {
    totalScore += win + paper;
  }
  if (map[them] === 'PAPER' && map[me] === 'LOSE') {
    totalScore += lose + rock;
  }
  if (map[them] === 'PAPER' && map[me] === 'DRAW') {
    totalScore += draw + paper;
  }
  if (map[them] === 'PAPER' && map[me] === 'WIN') {
    totalScore += win + scissors;
  }
  if (map[them] === 'SCISSORS' && map[me] === 'LOSE') {
    totalScore += lose + paper;
  }
  if (map[them] === 'SCISSORS' && map[me] === 'DRAW') {
    totalScore += draw + scissors;
  }
  if (map[them] === 'SCISSORS' && map[me] === 'WIN') {
    totalScore += win + rock;
  }
});

console.log(totalScore);

import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

// AX = Rock
// BY = Paper
// CZ = Scissors

const map: any = {
  'A': 'ROCK',
  'X': 'ROCK',
  'B': 'PAPER',
  'Y': 'PAPER',
  'C': 'SCISSORS',
  'Z': 'SCISSORS',
}

let totalScore = 0;
const win = 6;
const draw = 3;
const lose = 0;
data.forEach(round => {
  const [them, me] = round.split(' ');
  if (map[them] === map[me]) {
    totalScore += draw;
  }

  if (map[them] === 'ROCK' && map[me] === 'PAPER') {
    totalScore += win;
  }
  if (map[them] === 'ROCK' && map[me] === 'SCISSORS') {
    totalScore += lose;
  }
  if (map[them] === 'PAPER' && map[me] === 'SCISSORS') {
    totalScore += win;
  }
  if (map[them] === 'PAPER' && map[me] === 'ROCK') {
    totalScore += lose;
  }
  if (map[them] === 'SCISSORS' && map[me] === 'ROCK') {
    totalScore += win;
  }
  if (map[them] === 'SCISSORS' && map[me] === 'PAPER') {
    totalScore += lose;
  }

  if (map[me] === 'ROCK') {
    totalScore += 1;
  }
  if (map[me] === 'PAPER') {
    totalScore += 2;
  }
  if (map[me] === 'SCISSORS') {
    totalScore += 3;
  }
});

console.log(totalScore);

// let totalScore = 0;
// data.forEach((round) => {
//   const [them, me] = round.split(' ');
//   let tempScore = 0;
//   if (them.charCodeAt(0) + 23 > me.charCodeAt(0)) {
//     console.log('lost');
//     tempScore += 0;
//   } else if (them.charCodeAt(0) + 23 === me.charCodeAt(0)) {
//     console.log('draw');
//     tempScore += 3;
//   } else if (them.charCodeAt(0) + 23 < me.charCodeAt(0)) {
//     console.log('win')
//     tempScore += 6;
//   } else {
//     throw new Error();
//   }

//   if (me === 'X') {
//     tempScore += 1;
//   }
//   if (me === 'Y') {
//     tempScore += 2;
//   }
//   if (me === 'Z') {
//     tempScore += 3;
//   }
  
//   // tempScore += me.charCodeAt(0) - 23 - 65 + 1;
//   totalScore += tempScore;
// });

// console.log(totalScore);


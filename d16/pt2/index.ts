import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

type Valve = { name: string, rate: number, children: string[] };
const valves: {[name: string]: Valve } = {};
data.forEach(rawValve => {
  const [,name,,,rawRate,,,,,...children] = rawValve.replaceAll(',', '').split(' ');
  const rate = +rawRate.split('=')[1].split(';')[0];
  valves[name] =  { name, rate, children };
});

const known: {[key: string]: number} = {};
const makeDecision = (valve: Valve, decisions: string, timeLeft: number): number => {
  // console.log({valve, decisions })
  if (timeLeft >= 25) {
    console.log(decisions);
  }
  if (timeLeft <= 0) {
    return 0;
  }

  // if (known[decisions] != undefined) {
  //   return known[decisions];
  // }

  let totalRate = 0;
  const lastDecision = decisions.slice(-6);
  
  const [a, b] = lastDecision.split('->')!;
  if (a === b) {
    totalRate += (valve.rate * timeLeft);
  }

  const possibleDecisions = [];
  if (valve.rate > 0) {
    const nextDecision = `${valve.name}->${valve.name}`;
    if (!decisions.includes(nextDecision)) {
      possibleDecisions.push({ valve, nextDecision });
    }
  }

  for (let i = 0; i < valve.children.length; i++) {
    const child = valve.children[i];
    const nextDecision = `${valve.name}->${child}`;
    if (decisions.includes(nextDecision)) {
      continue;
    }

    if (a === child && b === valve.name) {
      // Don't go back unless you've turned on a valve
      continue;
    }

    possibleDecisions.push({ valve: valves[child], nextDecision });
  }

  if (possibleDecisions.length > 0) {
    totalRate += Math.max(...possibleDecisions.map(dec => makeDecision(dec.valve, decisions + ',' + dec.nextDecision, timeLeft - 1)));
  }

  // known[decisions] = totalRate;

  return totalRate;
}

console.log(makeDecision(valves['AA'], 'AA->AA', 30) + 2);


// const getNextDecision = (valveId: string) => {
//   const next = valves[valveId].children.map(child => `${valveId}->${child}`);
//   next.push(`${valveId}->${valveId}`);
//   return next;
// }

// let maxPressureRelease = 0;
// const bfs = () => {
//   const queue = [{ decision: 'AA->AA', totalPressure: 0, timeLeft: 30 }];
//   const seen = new Set<string>();

//   while (queue.length > 0) {
//     const { decision, totalPressure, timeLeft } = queue.shift()!;
//     maxPressureRelease = Math.max(maxPressureRelease, totalPressure);
//     if (timeLeft <= 0) {
//       console.log('yo');
//       continue;
//     }

//     const currentValve = decision.split('->')[1];
//     for (const nextDecision of getNextDecision(currentValve)) {
//       if (seen.has(`${nextDecision}@${timeLeft}`)) {
//         continue; 
//       }
//       seen.add(`${nextDecision}@${timeLeft}`);

//       const [valveA, valveB] = nextDecision.split('->');
//       if (valveA === valveB) {
//         console.log({valveA, valveB})
//         queue.push({ decision: nextDecision, totalPressure: totalPressure + (valves[valveA].rate * timeLeft), timeLeft: timeLeft - 1 }); 
//       }
//       queue.push({ decision: nextDecision, totalPressure, timeLeft: timeLeft - 1 });
//     }
//   }

//   return -1; // 9. If you didn't find the answer, return something like -1/null/undefined.
// }

// console.log(bfs());
// console.log(maxPressureRelease);
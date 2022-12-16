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

// premap each of the working valves to each other so that I can cut out the middle steps

const getNextValve = (valveId: string) => {
  const next = valves[valveId].children;
  return next;
}

const findShortestDistance = (start: string, end: string) => {
  const queue = [{ position: start, distance: 0 }];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const { position, distance } = queue.shift()!;
    if (position === end) {
      return distance;
    }

    for (const nextPosition of getNextValve(position)) {
      if (seen.has(nextPosition)) {
        continue; 
      }
      seen.add(nextPosition);

      queue.push({ position: nextPosition, distance: distance + 1 });
    }
  }

  return -1;
}

const distances: { [start: string]: { [end: string]: number } } = {};
const valveArray = Object.values(valves);
for (let i = 0; i < valveArray.length; i++) {
  const valveA = valveArray[i];
  for (let j = 0; j < valveArray.length; j++) {
    if (i === j) {
      continue;
    }

    const valveB = valveArray[j];

    if (valveA.rate === 0 || valveB.rate === 0) {
      if (valveA.name === 'AA') {
        if (valveB.rate === 0) {
          continue;
        }
      } else {
        continue;
      }
    }

    if (!distances[valveA.name]) {
      distances[valveA.name] = {};
    }

    distances[valveA.name][valveB.name] = findShortestDistance(valveA.name, valveB.name) + 1; // +1 is activation cost
  }
}

console.log(JSON.stringify(distances, null, 2));

const makeDecision = (valve: Valve, decisions: string, timeLeft: number): number => {
  if (timeLeft <= 0) {
    return 0;
  }

  let totalRate = (valve.rate * timeLeft);

  const possibleDecisions = [];
  const childrenIds = Object.keys(distances[valve.name]);
  for (let i = 0; i < childrenIds.length; i++) {
    const childId = childrenIds[i];
    const nextDecision = childId;
    if (decisions.includes(nextDecision)) {
      continue;
    }

    if (timeLeft - distances[valve.name][childId] < 0) {
      continue;
    }

    possibleDecisions.push({ valve: valves[childId], nextDecision, timeConsumed: distances[valve.name][childId] });
  }

  if (possibleDecisions.length > 0) {
    totalRate += Math.max(...possibleDecisions.map(dec => makeDecision(dec.valve, decisions + ',' + dec.nextDecision, timeLeft - dec.timeConsumed)));
  }

  return totalRate;
}

console.log(makeDecision(valves['AA'], 'AA', 30));
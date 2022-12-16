import * as fs from 'fs';
import * as _ from 'lodash';

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

// AA DD JJ BB HH CC EE
// console.log(JSON.stringify(distances, null, 2));
const AAChildren = Object.keys(distances['AA']);
const makeDecision = (me: { id: string, timeLeft: number }, ele: { id: string, timeLeft: number }, decisions: string): number => {
  if (me.timeLeft <= 0 && ele.timeLeft <= 0) {
    return 0;
  }

  // console.log(decisions);

  let totalRate = 0;
  const visited = decisions.split(',');
  const availableIds = _.difference(AAChildren, visited);

  if (availableIds.length === 0) {
    return me.timeLeft * valves[me.id].rate + ele.timeLeft * valves[ele.id].rate;
  }

  const maxOut: any[] = [];
  for (let i = 0; i < availableIds.length; i++) {
    const nextId = availableIds[i];
    if (me.timeLeft === ele.timeLeft) {
      // console.log('=')
      const meOut = { realized: (valves[me.id].rate * me.timeLeft), children: makeDecision({ id: nextId, timeLeft: me.timeLeft - distances[me.id][nextId]}, ele, decisions + ',' + nextId) };
      const eleOut = { id: nextId, realized: (valves[ele.id].rate * ele.timeLeft), children: makeDecision(me, { id: nextId, timeLeft: ele.timeLeft - distances[ele.id][nextId]}, decisions + ',' + nextId) };
      maxOut.push(meOut, eleOut);
    } else if (me.timeLeft > ele.timeLeft) {
      // console.log('m')
      const meOut = { realized: (valves[me.id].rate * me.timeLeft), children: makeDecision({ id: nextId, timeLeft: me.timeLeft - distances[me.id][nextId]}, ele, decisions + ',' + nextId) };
      maxOut.push(meOut);
    } else if (ele.timeLeft > me.timeLeft) {
      // console.log('e');
      const eleOut = { id: nextId, realized: (valves[ele.id].rate * ele.timeLeft), children: makeDecision(me, { id: nextId, timeLeft: ele.timeLeft - distances[ele.id][nextId]}, decisions + ',' + nextId) };
      maxOut.push(eleOut);
    } else {
      throw new Error();
    }
  }

  if (maxOut.length > 0) {
    maxOut.sort((a, b) => (b.children + b.realized) - (a.children + a.realized));
    
    totalRate += maxOut[0].children + maxOut[0].realized;
  }

  if (maxOut.length === 0) {
    throw new Error();
  }

  return totalRate;
}

const r = makeDecision({ id: 'AA', timeLeft: 26 }, { id: 'AA', timeLeft: 26 }, 'AA')
console.log(r)
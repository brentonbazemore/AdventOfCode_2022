import * as fs from 'fs';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

type Requirement = {
  type: 'ore' | 'clay' | 'obsidian';
  amount: number;
};
class Blueprint {
  id: number;
  ore: Requirement[] = [];
  clay: Requirement[] = [];
  obsidian: Requirement[] = [];
  geode: Requirement[] = [];

  maxOre: number;
  maxClay: number;
  maxObsidian: number;

  constructor(rawString: string) {
    const [rawId,rawOre,rawClay,rawObsidian,rawGeode] = rawString.split('Each ');
    this.id = +rawId.split('Blueprint ')[1].split(':')[0];
    this.ore.push({ type: 'ore', amount: +rawOre.split(' ')[3] });
    this.clay.push({ type: 'ore', amount: +rawClay.split(' ')[3] });
    this.obsidian.push({ type: 'ore', amount: +rawObsidian.split(' ')[3] }, { type: 'clay', amount: +rawObsidian.split(' ')[6] });
    this.geode.push({ type: 'ore', amount: +rawGeode.split(' ')[3] }, { type: 'obsidian', amount: +rawGeode.split(' ')[6] });

    this.maxOre = Math.max(this.ore[0].amount, this.clay[0].amount, this.obsidian[0].amount, this.geode[0].amount);
    this.maxClay = Math.max(this.obsidian[1].amount);
    this.maxObsidian = Math.max(this.geode[1].amount);
  }
}

const getPossibleDecisions = (blueprint: Blueprint, ore: number, clay: number, obsidian: number, geode: number, oreRobots: number, clayRobots: number, obsidianRobots: number, geodeRobots: number, timeLeft: number) => {
  const decisions: ('ore' | 'clay' | 'obsidian' | 'geode' | 'nothing')[] = [];
  if (ore >= blueprint.geode[0].amount && obsidian >= blueprint.geode[1].amount) {
    decisions.push('geode');
    return decisions;
  }
  if (oreRobots < blueprint.maxOre && (ore >= blueprint.ore[0].amount) && (ore < blueprint.maxOre * timeLeft)) {
    decisions.push('ore');
  }
  if (clayRobots < blueprint.maxClay && (ore >= blueprint.clay[0].amount) && (clay < blueprint.maxClay * timeLeft)) {
    decisions.push('clay');
  }
  if (obsidianRobots < blueprint.maxObsidian && (ore >= blueprint.obsidian[0].amount && clay >= blueprint.obsidian[1].amount) && (obsidian < blueprint.maxObsidian * timeLeft)) {
    decisions.push('obsidian');
  }

  decisions.push('nothing');

  return decisions;
}

const simulate = (blueprint: Blueprint, ore: number, clay: number, obsidian: number, geode: number, oreRobots: number, clayRobots: number, obsidianRobots: number, geodeRobots: number, timeLeft: number, highest: {[time: number]: number}): number => {
  if (timeLeft <= 0) {
    return geode;
  }

  if (timeLeft <= 1 && geodeRobots === 0) {
    return 0;
  }

  if (timeLeft <= 2 && obsidianRobots === 0) {
    return 0;
  }

  if (timeLeft <= 3 && clayRobots === 0) {
    return 0;
  }

  const potentialMax = geode + (geodeRobots * timeLeft) + ((timeLeft * (timeLeft - 1)) / 2);
  if (highest[timeLeft] > potentialMax) {
    return 0;
  }

  const decisions = getPossibleDecisions(blueprint, ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, timeLeft);

  const outcomes = decisions.map(decision => {
    if (decision === 'ore') {
      return simulate(blueprint, oreRobots + (ore - blueprint.ore[0].amount), clayRobots + clay, obsidianRobots + obsidian, geodeRobots + geode, oreRobots + 1, clayRobots, obsidianRobots, geodeRobots, timeLeft - 1, highest);
    } else if (decision === 'clay') {
      return simulate(blueprint, oreRobots + (ore - blueprint.clay[0].amount), clayRobots + clay, obsidianRobots + obsidian, geodeRobots + geode, oreRobots, clayRobots + 1, obsidianRobots, geodeRobots, timeLeft - 1, highest);
    } else if (decision === 'obsidian') {
      return simulate(blueprint, oreRobots + (ore - blueprint.obsidian[0].amount), clayRobots + (clay - blueprint.obsidian[1].amount), obsidianRobots + obsidian, geodeRobots + geode, oreRobots, clayRobots, obsidianRobots + 1, geodeRobots, timeLeft - 1, highest);
    } else if (decision === 'geode') {
      return simulate(blueprint, oreRobots + (ore - blueprint.geode[0].amount), clayRobots + clay, obsidianRobots + (obsidian - blueprint.geode[1].amount), geodeRobots + geode, oreRobots, clayRobots, obsidianRobots, geodeRobots + 1, timeLeft - 1, highest);
    } else {
      return simulate(blueprint, oreRobots + ore, clayRobots + clay, obsidianRobots + obsidian, geodeRobots + geode, oreRobots, clayRobots, obsidianRobots, geodeRobots, timeLeft - 1, highest);
    }
  });

  const max = Math.max(...outcomes);
  highest[timeLeft] = Math.max(max, (highest[timeLeft] || 0));
  return max;
}

if (isMainThread) {
  const inputFile = process.argv[2];
  const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
  const data: string[] = rawData.split('\n');
  const blueprints = data.map(d => new Blueprint(d)).slice(0, 3);
  const threads = new Set<Worker>();
  blueprints.forEach(blueprint => {
    threads.add(new Worker(__filename, { workerData: { blueprint }}));
  });

  let sum = 1;
  for (let worker of threads) {
    worker.on('error', (e) => { throw e; });
    worker.on('exit', () => {
      threads.delete(worker);
      console.log(`Thread exiting, ${threads.size} running...`);
      if (threads.size === 0) {
        console.log(sum)
      }
    });
    worker.on('message', (msg: { out: number }) => {
      if (msg.out) {
        sum *= msg.out;
      } else {
        console.log(msg);
      }
    });
  }
} else {
  const time = 32;
  console.log('Simulating', workerData.blueprint.id)
  const highest: {[time: number]: number} = { 10: 1, 9: 1, 8: 1, 7: 1, 6: 1, 5: 1, 4: 1, 3: 1, 2: 1, 1: 1 };
  const out = simulate(workerData.blueprint, 0, 0, 0, 0, 1, 0, 0, 0, time, highest);
  console.log('Finished:', workerData.blueprint.id, 'Out:', out);
  parentPort?.postMessage({ out: out });
}


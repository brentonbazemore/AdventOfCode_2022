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

interface Factory {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
  oreRobots: number;
  clayRobots: number;
  obsidianRobots: number;
  geodeRobots: number;
}

const getPossibleDecisions = (blueprint: Blueprint, factory: Factory) => {
  const decisions: ('ore' | 'clay' | 'obsidian' | 'geode' | 'nothing')[] = [];
  if (factory.ore >= blueprint.geode[0].amount && factory.obsidian >= blueprint.geode[1].amount) {
    decisions.push('geode');
    return decisions;
  }
  if (factory.oreRobots < blueprint.maxOre && (factory.ore >= blueprint.ore[0].amount)) {
    decisions.push('ore');
  }
  if (factory.clayRobots < blueprint.maxClay && (factory.ore >= blueprint.clay[0].amount)) {
    decisions.push('clay');
  }
  if (factory.obsidianRobots < blueprint.maxObsidian && (factory.ore >= blueprint.obsidian[0].amount && factory.clay >= blueprint.obsidian[1].amount)) {
    decisions.push('obsidian');
  }
  
  decisions.push('nothing');

  return decisions;
}
  
const mine = (factory: Factory): Factory => {
  return {
    ore: factory.ore + factory.oreRobots,
    clay: factory.clay + factory.clayRobots,
    obsidian: factory.obsidian + factory.obsidianRobots,
    geode: factory.geode + factory.geodeRobots,
    oreRobots: factory.oreRobots,
    clayRobots: factory.clayRobots,
    obsidianRobots: factory.obsidianRobots,
    geodeRobots: factory.geodeRobots,
  };
}

const addRobotType = {
  'ore': (factory: Factory) => factory.oreRobots++,
  'clay': (factory: Factory) => factory.clayRobots++,
  'obsidian': (factory: Factory) => factory.obsidianRobots++,
  'geode': (factory: Factory) => factory.geodeRobots++,
}
const spawn = (blueprint: Blueprint, factory: Factory, type: 'ore' | 'clay' | 'obsidian' | 'geode') => {
  addRobotType[type](factory);
  for (let i = 0; i < blueprint[type].length; i++) {
    factory[blueprint[type][i].type] -= blueprint[type][i].amount;
  }
}

const simulate = (blueprint: Blueprint, factory: Factory, timeLeft: number): number => {
  if (timeLeft <= 0) {
    return factory.geode;
  }

  if (timeLeft <= 1 && factory.geodeRobots === 0) {
    return 0;
  }

  if (timeLeft <= 2 && factory.obsidianRobots === 0) {
    return 0;
  }

  if (timeLeft <= 3 && factory.clayRobots === 0) {
    return 0;
  }

  const decisions = getPossibleDecisions(blueprint, factory);

  const outcomes = decisions.map(decision => {
    const newFactory = mine(factory);

    if (decision !== 'nothing') {
      spawn(blueprint, newFactory, decision);
    }
    
    return simulate(blueprint, newFactory, timeLeft - 1);
  })

  const max = Math.max(...outcomes);
  return max;
}

if (isMainThread) {
  const inputFile = process.argv[2];
  const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
  const data: string[] = rawData.split('\n');
  const blueprints = data.map(d => new Blueprint(d));
  // const threadCount = blueprints.length;
  const threads = new Set<Worker>();
  blueprints.forEach(blueprint => {
    threads.add(new Worker(__filename, { workerData: { blueprint }}));
  });

  let sum = 0;
  for (let worker of threads) {
    worker.on('error', (e) => { throw e; });
    worker.on('exit', () => {
      threads.delete(worker);
      console.log(`Thread exiting, ${threads.size} running...`);
      if (threads.size === 0) {
        console.log(sum)
      }
    });
    worker.on('message', (msg: number) => {
      sum += msg;
    });
  }
} else {
  const time = 24;
  console.log('Simulating', workerData.blueprint.id)
  const out = simulate(workerData.blueprint, { ore: 0, clay: 0, obsidian: 0, geode: 0, oreRobots: 1, clayRobots: 0, obsidianRobots: 0, geodeRobots: 0 }, time);
  parentPort?.postMessage(out * workerData.blueprint.id);
}


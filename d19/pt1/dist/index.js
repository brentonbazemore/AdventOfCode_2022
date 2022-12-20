"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const worker_threads_1 = require("worker_threads");
class Blueprint {
    id;
    ore = [];
    clay = [];
    obsidian = [];
    geode = [];
    maxOre;
    maxClay;
    maxObsidian;
    constructor(rawString) {
        const [rawId, rawOre, rawClay, rawObsidian, rawGeode] = rawString.split('Each ');
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
const getPossibleDecisions = (blueprint, factory) => {
    const decisions = [];
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
};
const mine = (factory) => {
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
};
const addRobotType = {
    'ore': (factory) => factory.oreRobots++,
    'clay': (factory) => factory.clayRobots++,
    'obsidian': (factory) => factory.obsidianRobots++,
    'geode': (factory) => factory.geodeRobots++,
};
const spawn = (blueprint, factory, type) => {
    addRobotType[type](factory);
    for (let i = 0; i < blueprint[type].length; i++) {
        factory[blueprint[type][i].type] -= blueprint[type][i].amount;
    }
};
const simulate = (blueprint, factory, timeLeft) => {
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
    });
    const max = Math.max(...outcomes);
    return max;
};
if (worker_threads_1.isMainThread) {
    const inputFile = process.argv[2];
    const rawData = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
    const data = rawData.split('\n');
    const blueprints = data.map(d => new Blueprint(d));
    // const threadCount = blueprints.length;
    const threads = new Set();
    blueprints.forEach(blueprint => {
        threads.add(new worker_threads_1.Worker(__filename, { workerData: { blueprint } }));
    });
    let sum = 0;
    for (let worker of threads) {
        worker.on('error', (e) => { throw e; });
        worker.on('exit', () => {
            threads.delete(worker);
            console.log(`Thread exiting, ${threads.size} running...`);
            if (threads.size === 0) {
                console.log(sum);
            }
        });
        worker.on('message', (msg) => {
            sum += msg;
        });
    }
}
else {
    const time = 24;
    console.log('Simulating', worker_threads_1.workerData.blueprint.id);
    const out = simulate(worker_threads_1.workerData.blueprint, { ore: 0, clay: 0, obsidian: 0, geode: 0, oreRobots: 1, clayRobots: 0, obsidianRobots: 0, geodeRobots: 0 }, time);
    worker_threads_1.parentPort?.postMessage(out * worker_threads_1.workerData.blueprint.id);
}
//# sourceMappingURL=index.js.map
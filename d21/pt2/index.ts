import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

const operations = {
  '*': (a: number, b: number) => a * b,
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '/': (a: number, b: number) => a / b,
  '=': (a: number, b: number) => +(a === b),
};
type Monkey = {
  type: 'yeller';
  value: number;
} | { 
  type: 'doer', 
  value: number | null, 
  operation: (a: number, b: number) => number;
  dep1: string;
  dep2: string;
}

const getMonkeys = () => {
  const monkeys: {[id: string]: Monkey} = {};
  data.forEach(rawMonkey => {
    const [id, rawOperation] = rawMonkey.split(': ');
    const opTokens = rawOperation.split(' ');
    if (id === 'root') {
      opTokens[1] = '=';
    }

    if (opTokens.length === 1) {
      monkeys[id] = {
        type: 'yeller',
        value: +opTokens[0],
      };
    } else {
      monkeys[id] = {
        type: 'doer',
        value: null,
        operation: operations[opTokens[1] as '+' | '*' | '-' | '/' | '='],

        dep1: opTokens[0],
        dep2: opTokens[2],
      }
    }
  });

  return monkeys;
}

const solve = (humanYell: number, monkeys: {[id: string]: Monkey}, id: string): number => {
  const monkey = monkeys[id];
  if (id === 'humn'){ 
    return humanYell;
  }

  if (monkey.type === 'yeller') {
    return monkey.value;
  }

  if (monkey.value != null) {
    return monkey.value;
  }

  const dep1 = solve(humanYell, monkeys, monkey.dep1);
  const dep2 = solve(humanYell, monkeys, monkey.dep2);

  monkey.value = monkey.operation(dep1, dep2);
  return monkey.value;
};

const solveFor = (humanYell: number) => {
  const monkeys = getMonkeys();

  return solve(humanYell, monkeys, 'cmmh');
}

const target = 7012559479583; // static result from non human dependent side of tree
for (let i = 0; i < 5; i++) {
  const human = 3665520865940 + i; // TODO: binary search for this value instead of manually running a binary search lol
  const result = solveFor(human);
  console.log(result, result > target ? 'up' : 'down');
  if (target === result) {
    console.log(human);
    break;
  }
}

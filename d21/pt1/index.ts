import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

const operations = {
  '*': (a: number, b: number) => a * b,
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '/': (a: number, b: number) => a / b,
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
const monkeys: {[id: string]: Monkey} = {};
data.forEach(rawMonkey => {
  const [id, rawOperation] = rawMonkey.split(': ');
  const opTokens = rawOperation.split(' ');

  if (opTokens.length === 1) {
    monkeys[id] = {
      type: 'yeller',
      value: +opTokens[0],
    };
  } else {
    monkeys[id] = {
      type: 'doer',
      value: null,
      operation: operations[opTokens[1] as '+' | '*' | '-' | '/'],
      dep1: opTokens[0],
      dep2: opTokens[2],
    }
  }
});

const solve = (id: string): number => {
  const monkey = monkeys[id];
  if (monkey.type === 'yeller') {
    return monkey.value;
  }

  if (monkey.value != null) {
    return monkey.value;
  }

  const dep1 = solve(monkey.dep1);
  const dep2 = solve(monkey.dep2);

  monkey.value = monkey.operation(dep1, dep2);
  return monkey.value;
};

console.log(solve('root'));
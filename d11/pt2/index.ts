import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n\n');

const primes: number[] = [];
class Monkey {
  id: number;
  items: number[] = [];
  inspect: (worryLevel: number) => number;
  postInspection = (worryLevel: number, lcd: number) => {
    this.inspectionCount++;
    return worryLevel % lcd;
  }
  test: (worryLevel: number) => number;
  inspectionCount: number = 0;

  constructor(raw: string) {
    const lines = raw.split('\n');
    this.id = +lines[0][7];
    this.items = lines[1].split(': ')[1].split(', ').map(Number);

    const [, ,one, symbol, two] = lines[2].split(': ')[1].split(' ');
    this.inspect = (worryLevel: number) => {
      let op1 = +one;
      let op2 = +two;
      if (one === 'old') {
        op1 = worryLevel;
      }
      if (two === 'old') {
        op2 = worryLevel;
      }

      if (symbol === '*') {
        return op1 * op2;
      }

      if (symbol === '+') {
        return op1 + op2;
      }

      throw new Error('invalid');
    }

    const divisor = +lines[3].split('divisible by ')[1];
    primes.push(divisor);
    const trueDest = +lines[4].split('to monkey ')[1];
    const falseDest = +lines[5].split('to monkey ')[1];
    this.test = (worryLevel: number) => {
      const isDivisble = worryLevel % divisor === 0;
      if (isDivisble) {
        return trueDest;
      } else {
        return falseDest;
      }
    }
  }

  catch(item: number) {
    this.items.push(item);
  }

  throw() {
    const item = this.items.shift();
    return item;
  }
}

const monkeys = data.map(rawMonkey => {
  return new Monkey(rawMonkey);
});

const lcd = primes.reduce((prev, cur) => prev * cur, 1)

const rounds = 10000;
for (let i = 0; i < rounds; i++) {
  monkeys.forEach((monkey) => {
    while (monkey.items.length > 0) {
      const item = monkey.throw();
      if (item == undefined) {
        break;
      }

      const inspectedItem = monkey.inspect(item);
      const postInspectedItem = monkey.postInspection(inspectedItem, lcd);
      const targetMonkey = monkey.test(postInspectedItem);
      monkeys[targetMonkey].catch(postInspectedItem);
    }
  });
}

const [first, second] = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount).map(m => m.inspectionCount);
console.log(first * second);
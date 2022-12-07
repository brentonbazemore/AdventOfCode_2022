import * as fs from 'fs';

const inputFile = process.argv[2];
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

type TreeNode = { children: {[key: string]: TreeNode } | null, size: number };
const files: TreeNode = {
  children: {
    '/': {
      children: {},
      size: 0,
    }
  },
  size: 0, 
};

let pwd: string[] = [];
data.forEach((cmd) => {
  if (cmd.slice(0, 4) === '$ cd') {
    const dest = cmd.split('$ cd ')[1]
    if (dest === '..') {
      pwd.pop()
    } else if (dest === '/') {
      pwd = ['/'];
    } else {
      pwd.push(dest);
    }
  } else if (cmd.slice(0, 4) === '$ ls') {
    // handle ls - do nothing?
  } else if (cmd.slice(0, 3) === 'dir') {
    const newDir = cmd.split('dir ')[1];
    let directory = files;
    pwd.forEach((level) => {
      directory = directory.children![level];
    });
    directory.children![newDir] = { children: {}, size: 0 };
  } else {
    const size = +cmd.split(' ')[0];
    let directory = files;
    pwd.forEach((level) => {
      directory = directory.children![level];
      directory.size += size;
    });
  }
});

const currentTotal = files.children!['/'].size;
const target = 40000000;

const matches = [...JSON.stringify(files).matchAll(/"size":[0-9]+}/g)];
let candidate = { size: 0, newTotal: 0 };
matches.forEach(m => {
  const size = +m[0].split(':')[1].split('}')[0];
  const newTotal = currentTotal - size;
  if (newTotal < target) {
    if (newTotal > candidate.newTotal) {
      candidate = {
        newTotal,
        size,
      };
    }
  }
})

console.log(candidate.size);
import * as fs from 'fs';

const inputFile = process.argv[2];
const testing = inputFile != 'input.txt';
const rawData: string = fs.readFileSync(inputFile || 'inputTest.txt', 'utf8');
const data: string[] = rawData.split('\n');

type Coords = { x: number, y: number };
const getDistance = (a: Coords, b: Coords) => {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

type Location = {
  sensor: Coords,
  beacon: Coords,
  distance: number,
}

const locations = data.map(line => {
  const [rawSensor, rawBeacon] = line.split(': ');
  const rawSensorCoords = rawSensor.split('Sensor at ')[1];
  const [rawSensorX, rawSensorY] = rawSensorCoords.split(', ');
  const sensorX = +rawSensorX.split('=')[1];
  const sensorY = +rawSensorY.split('=')[1];

  const rawBeaconCoords = rawBeacon.split('closest beacon is at ')[1];
  const [rawBeaconX, rawBeaconY] = rawBeaconCoords.split(', ');
  const beaconX = +rawBeaconX.split('=')[1];
  const beaconY = +rawBeaconY.split('=')[1];

  return {
    sensor: {
      x: sensorX,
      y: sensorY,
    },
    beacon: {
      x: beaconX,
      y: beaconY,
    },
    distance: getDistance({ x: sensorX, y: sensorY }, {x: beaconX, y: beaconY }),
  };
});

// console.log(locations);
const coord2Key = ({ x, y }: Coords) => {
  return `${x},${y}`;
}

enum Tile {
  Sensor = 'S',
  Beacon = 'B',
  Area = '#',
  AreaStart = '1',
  AreaEnd = '2',
}
type Cave = { [key: string]: Tile };
const cave: Cave = {};
const bounds = {
  minX: Infinity,
  maxX: -Infinity,
  minY: Infinity,
  maxY: -Infinity,
}

const print = (c: Cave, buffer: number) => {
  for (let y = bounds.minY - buffer; y <= bounds.maxY + buffer; y++) {
    let row = `${y}`.padStart(3, ' ') + '';
    for (let x = bounds.minX - buffer; x <= bounds.maxX + buffer; x++) {
      row += c[`${x},${y}`] ? c[`${x},${y}`] : ' ';
    }
    console.log(row);
  }
}

const drawArea = ({ sensor, beacon, distance }: Location) => {
  bounds.minX = Math.min(bounds.minX, sensor.x - distance);
  bounds.maxX = Math.max(bounds.maxX, sensor.x + distance);
  bounds.minY = Math.min(bounds.minY, sensor.y - distance);
  bounds.maxY = Math.max(bounds.maxY, sensor.y + distance);
  for (let y = sensor.y - distance; y <= sensor.y + distance; y++) {
    if (y !== (testing ? 10 : 2000000)) {
      continue;
    }
    const extent = Math.abs(y - sensor.y);
    // const start = sensor.x - (distance - extent);
    // const end = sensor.x + (distance - extent);
    // if (start === end) {
    //   cave[coord2Key({ x: start, y })] = Tile.Area;
    // } else {
    //   cave[coord2Key({ x: start, y })] = Tile.AreaStart;
    //   cave[coord2Key({ x: end, y })] = Tile.AreaEnd;
    // }

    for (let x = sensor.x - (distance - extent); x <= sensor.x + (distance - extent); x++) {
      if (!cave[coord2Key({ x, y })]) {
        cave[coord2Key({ x, y })] = Tile.Area;
      }

      if (sensor.x === x && sensor.y === y) {
        cave[coord2Key({ x, y })] = Tile.Sensor;
      }

      if (beacon.x === x && beacon.y === y) {
        cave[coord2Key({ x, y })] = Tile.Beacon;
      }
    }
  }
}

// drawArea(locations[0]);
locations.forEach((location, i) => {
  console.log(location, i);
  drawArea(location);
});

const y = testing ? 10 : 2000000;
let total = 0;
for (let x = bounds.minX; x < bounds.maxX; x++) {
  const point = cave[coord2Key({ x, y })];
  total += (point === Tile.Area || point === Tile.Sensor) ? 1 : 0;
}
console.log(total);

// print(cave, 0);
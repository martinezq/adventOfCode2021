const fs = require('fs');
const R = require('ramda');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
const fileLines = file.split('\n');

const lineCommands = fileLines.map(line => line.match(/(\d+),(\d+) -> (\d+),(\d+)/)).map(x => x.slice(1)).map(x => x.map(Number));
const lines = lineCommands.map(makeLine);

const allPoints = lines.flat();

const groups = R.groupBy(x => `${x[0]},${x[1]}`, allPoints);
const dangerPoints = R.keys(groups).filter(k => groups[k].length > 1);

console.log(dangerPoints.length);

// -----------------------

function makeLine(line) {
    const x1 = line[0];
    const y1 = line[1];
    const x2 = line[2];
    const y2 = line[3];

    if (y1 === y2) {
        return Array.from({length: Math.abs(x1 - x2) + 1}, (_, i) => [i + Math.min(x1, x2), y1]);
    }

    if (x1 === x2) {
        return Array.from({length: Math.abs(y1 - y2) + 1}, (_, i) => [x1, i + Math.min(y1, y2)]);
    }

    return [];
}

const fs = require('fs');
const R = require('ramda');
const U = require('./utils');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();

const data = file.split('\r\n').map(x => x.split('').map(Number));

const width = data[0].length;
const height = data.length;

U.log(data);

const flat = data.flat();

U.log(flat, width, height);

const low = flat.filter((p, i) => {
    const x = i % width;
    const y = Math.floor(i / width);
    
    const tc = [
        x > 0 ? data[y][x-1] : 99,
        x < width - 1 ? data[y][x+1] : 99,
        y > 0 ?  data[y-1][x] : 99,
        y < height - 1 ? data[y+1][x] : 99
    ];

    const v = tc[0] > p && tc[1] > p && tc[2] > p && tc[3] > p;

    U.log(x, y, p, tc, v);

    return v;
});

U.log(low);

const risks = low.map(x => x + 1);

const sum = risks.reduce((p, c) => p + c, 0);

U.log(risks, sum);
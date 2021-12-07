const fs = require('fs');
const R = require('ramda');

const U = require('./utils');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();

const data = file.split(',').map(Number)

U.log(data);

// log(min(data), max(data));

const costs = R.range(U.minA(data), U.maxA(data)).map(x => {
    return data.reduce((p,c) => {
        const d = Math.abs(c - x);
        const cost = d * (1 + d) / 2;
        // U.log(x, c, cost);
        return p + cost;
    }, 0);
});

U.log(U.minA(costs));


// 1:1, 2:3, 3

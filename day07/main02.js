const fs = require('fs');
const R = require('ramda');

const { parse, log, logf } = require('./utils');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();

const data = file.split(',').map(Number)

log(data);

const min = (x) => x.reduce((p, c) => Math.min(p, c), Number.POSITIVE_INFINITY);
const max = (x) => x.reduce((p, c) => Math.max(p, c), Number.NEGATIVE_INFINITY);

// log(min(data), max(data));

const costs = R.range(min(data), max(data)).map(x => {
    return data.reduce((p,c) => {
        const d = Math.abs(c - x);
        const cost = d * (1 + d) / 2;
        // log(x, c, cost);
        return p + cost;
    }, 0);
});

log(min(costs));


// 1:1, 2:3, 3

const fs = require('fs');
const R = require('ramda');

const { parse, log, logf } = require('./utils');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();

const data = file.split(',').map(Number)

log(data);

const costs = data.map(x => {
    return data.reduce((p,c) => p + Math.abs(c - x), 0);
});

const min = costs.reduce((p, c) => Math.min(p, c), Number.POSITIVE_INFINITY)

log(costs, min);
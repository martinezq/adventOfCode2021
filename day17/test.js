const fs = require('fs');
const R = require('ramda');
const U = require('./utils');

const file = fs.readFileSync(`${__dirname}/test.txt`).toString();
const lines = file.split('\r\n');

const data = lines.map(l => l.split(/\s+/)).flat().sort();

U.logf(data);
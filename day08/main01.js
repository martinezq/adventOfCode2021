const fs = require('fs');
const R = require('ramda');
const U = require('./utils');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();

const data = file.split('\n').map(x => x.replaceAll('\r','')).map(x => x.split(' | '));

U.log(data);

const outputs = data.map(x => x[1].split(' ')).flat();
const sel = outputs.filter(x => [2, 4, 3, 7].indexOf(x.length) > -1);

U.log(outputs);

U.log(sel, sel.length);



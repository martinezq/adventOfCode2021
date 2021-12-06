const fs = require('fs');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
const data = file.split('\n').map(x => x.split('').filter(d => d.match(/[0-9]/)).map(d => Number(d)));

const first = data[0];
const len = first.length;

const gammaBin = first.map((d,i) => Math.round(data.reduce((p,c) => p + c[i], 0) / data.length));
const epsilonBin = gammaBin.map(inv);

console.log(gammaBin, epsilonBin);
console.log(dec(gammaBin), dec(epsilonBin));
console.log(dec(gammaBin) * dec(epsilonBin));

function inv(x) {
    return x == 0 ? 1 : 0;
}

function dec(a) {
    return a.reduce((p, c, i) => p + c * Math.pow(2, len - i - 1), 0);
}
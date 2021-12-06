const fs = require('fs');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
const data = file.split('\n').map(x => x.split('').filter(d => d.match(/[0-9]/)).map(d => Number(d)));

const first = data[0];
const len = first.length;

let data2 = data;

for (let i=0; i<len; i++) {
    const x = winBitAtPos(data2, i);
    data2 = data2.filter(d => d[i] === x);

    // console.log(JSON.stringify(data2));

    if (data2.length === 1) break;
}

const ox = dec(data2[0]);
console.log(data2[0], ox);

data2 = data;

for (let i=0; i<len; i++) {
    const x = inv(winBitAtPos(data2, i));
    data2 = data2.filter(d => d[i] === x);

    // console.log(JSON.stringify(data2));

    if (data2.length === 1) break;
}

const co2 = dec(data2[0]);


console.log(data2[0], co2);


console.log(ox * co2);

// ---------------------------------------

function winBitAtPos(data, pos) {
    const count = data.filter(x => x[pos] === 1).length;
    return Math.round(count / data.length);
    // console.log(JSON.stringify(data), p)
    // return p;//count === data.length / 2 ? 1 : p;
}

function inv(x) {
    return x == 0 ? 1 : 0;
}

function dec(a) {
    return a.reduce((p, c, i) => p + c * Math.pow(2, len - i - 1), 0);
}
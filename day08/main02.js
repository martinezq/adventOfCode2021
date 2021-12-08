const { INSPECT_MAX_BYTES } = require('buffer');
const fs = require('fs');
const R = require('ramda');
const U = require('./utils');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();

const data = file.split('\n').map(x => x.replaceAll('\r','')).map(x => x.split(' | '));

// U.log(data);
let sum = 0;

data.map(line => {
    sum += decode(line);
})

U.log(sum);

function decode(line) {
    const digitCodes = line[0].split(' ').map(x => x.split('').sort().join(''));
    const outCodes = line[1].split(' ').map(x => x.split('').sort().join(''));;

    const ofl = l => digitCodes.find(x => x.length === l);
    const aofl = l => digitCodes.filter(x => x.length === l);

    let result = [
        undefined,
        ofl(2),
        undefined,
        undefined,
        ofl(4),
        undefined,
        undefined,
        ofl(3),
        ofl(7),
        undefined
    ];

    result[6] = aofl(6).filter(x => diff(diff(result[8], x), result[1]).length === 0)[0];
    result[3] = aofl(5).filter(x => diff(x, result[1]).length === 3)[0];
    result[2] = aofl(5).filter(x => diff(x, result[4]).length === 3)[0];
    result[5] = aofl(5).filter(x => diff(x, result[4]).length === 2 && x !== result[3])[0];
    result[9] = aofl(6).filter(x => diff(diff(x, result[5]), result[1]).length === 0)[0];
    result[0] = aofl(6).filter(x => diff(x, result[1]).length === 4 && x != result[9] && x != result[6])[0];

    U.log(digitCodes, result);

    const outDigits = outCodes.map(c => result.indexOf(c));
    const val = outDigits.reduce((p, c, i) => p + c * Math.pow(10, outDigits.length - i - 1), 0)

    U.log(outCodes, outDigits, val);

    return val;
}

// ----

function sumCodes(a, b) {
    return R.uniq(a.concat(b)).sort().join('');
}

function diff(a, b) {
    return a.split('').filter(x => b.split('').indexOf(x) === -1).join('');
}

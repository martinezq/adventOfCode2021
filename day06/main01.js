const fs = require('fs');
const R = require('ramda');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
const initialAges = file.split(',').map(Number);

let ages = initialAges;

console.log(ages);

R.times(i => {
    ages = nextDay(ages);
    console.log(i, ages);
}, 80);

function nextDay(ages) {
    ages = ages.map(a => a - 1);
    const zeros = ages.filter(a => a < 0);
    ages = ages.map(a => a < 0 ? 6 : a);

    return ages.concat(zeros.map(z => 8));
}

console.log(ages.length)
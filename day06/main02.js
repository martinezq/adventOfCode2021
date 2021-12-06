const { count } = require('console');
const fs = require('fs');
const R = require('ramda');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
const initialAges = file.split(',').map(Number);

const groups = R.groupBy(R.identity, initialAges);
const keys = R.keys(groups);

let ages = Array.from({length: 9}, (_, i) => i).map(age => groups[age] ? groups[age].length : 0)

console.log(-1, JSON.stringify(ages));

R.times(i => {
    ages = nextDay(ages);
    console.log(i, JSON.stringify(ages), ages.reduce((p, c) => p + c, 0));
}, 256);

function nextDay(ages) {
    const dead = R.head(ages);
    ages = ages.map((_, i) => ages[i+1]);
    ages[8] = dead;
    ages[6] += dead;

    return ages;
}

// const total = ages.reduce((p, c) => p + c, 0);

// console.log(total)
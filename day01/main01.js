const fs = require('fs');

const file = fs.readFileSync('input.txt').toString();
const data = file.split('\n').map(x => Number(x));

const valid = data.filter((v,i) => v>data[i-1]);

console.log(valid.length);
const fs = require('fs');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
const data = file.split('\n').map(x => Number(x));

// const data = dataOrg.concat([0, 0]);

const windows = data.map((v,i) => v + data[i+1]+ data[i+2]).filter(v => !Number.isNaN(v));
const valid = windows.filter((v,i) => v>windows[i-1]);

console.log(valid);
const fs = require('fs');

const file = fs.readFileSync('input.txt').toString();
const data = file.split('\n').map(x => x.split(' '));

const forwards = data.filter(x => x[0] === 'forward').map(x => Number(x[1]))
const ups = data.filter(x => x[0] === 'up').map(x => Number(x[1]))
const downs = data.filter(x => x[0] === 'down').map(x => Number(x[1]))

const totalForward = forwards.reduce((x, y) => x + y, 0);
const totalUp = ups.reduce((x, y) => x + y, 0);
const totalDown = downs.reduce((x, y) => x + y, 0);

const deltaX = totalForward;
const deltaY = totalDown - totalUp;

console.log(deltaX * deltaY);
// console.log(JSON.stringify(data2, null, 2));
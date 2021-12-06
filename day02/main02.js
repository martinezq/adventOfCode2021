const fs = require('fs');

const file = fs.readFileSync('input.txt').toString();
const data = file.split('\n').map(x => x.split(' ')).map(x => [x[0], Number(x[1])]);

let aim = 0;
let x = 0;
let y = 0;

data.forEach(
    (curr) => {
        const cmd = curr[0];
        const change = curr[1];

        if (cmd === 'down') aim += change;
        if (cmd === 'up') aim -= change;

        if (cmd === 'forward') {
            x += change;
            y += change * aim;
        }
    }
);

 console.log(x * y);
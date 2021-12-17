const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines[0];

    const dataParts = data.match(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/).slice(1).map(Number);
    const [x1, x2, y1, y2] = dataParts;

    U.log(x1, x2, y1, y2);

    const result = [
        findX(x1, x2), findY(y1, y2)
    ];

    return result;
}


function findX(x1, x2) {
    const d = (0 >= x1 && 0 <= x2) ? 0 : Math.sign(x1 - 0);

    let a = d;
    let ok = false;

    do {
        ok = simulate(a, x1, x2, d, true);
        U.log(a, ok);
        a += d;
    } while(!ok);
}

function findY(y1, y2) {
    const d = -1;

    let a = 1000;
    let ok = false;

    do {
        ok = simulate(a, y1, y2, 1, false);
        U.log(a, ok);
        a += d;
    } while(!ok);
}

function simulate(a, x1, x2, d, stop) {
    let x = 0;
    let maxx = Number.NEGATIVE_INFINITY;
        
    while (x < x1 || x > x2) {
        // U.log(x);
        const xn = x + a;
        if (!stop || Math.abs(a) > 0) {
            a = a - d;
        }
        if ((x < x1 && xn > x2) || (x > x2 && xn < x1) || (a === 0 && stop)) {
            x = undefined
            return false;
        } else {
            x = xn;
            maxx = Math.max(maxx, x);
        }
    }

    U.log(maxx);

    return true;
}
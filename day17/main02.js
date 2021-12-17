const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines[0];

    const dataParts = data.match(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/).slice(1).map(Number);
    const [x1, x2, y1, y2] = dataParts;

    U.log(x1, x2, y1, y2);

    const allX = findAllX(x1, x2);
    const allY = findAllY(y1, y2);
    
    U.log(allX.length);
    U.log(allX);
    
    U.log(allY.length);
    U.log(allY);

    const times = R.uniq(allX.map(x => x.times).concat(allY.map(y => y.times)).flat()).sort((x, y) => x - y);

    U.log(times);

    const hits = times.map(t => {
        const xs = allX.filter(x => x.times.indexOf(t) > -1);
        const ys = allY.filter(y => y.times.indexOf(t) > -1);

        const out = xs.map(x => ys.map(y => [x.ax, y.ay])).flat();

        return out;
    }).flat();


    const hitsStr = hits.map(h => `[${h[0]},${h[1]}]`)

    const uniqHitStr = R.uniq(hitsStr).sort();

    U.logf(uniqHitStr)

    return uniqHitStr.length;
}


function findAllX(x1, x2) {
    const d = (0 >= x1 && 0 <= x2) ? 0 : Math.sign(x1 - 0);

    let a = d;
    let times;

    let result = [];

    do {
        times = simulate(a, x1, x2, d, true);
        if (times) result.push({ ax: a, times });
        a += d;
    } while(Math.abs(a) <= Math.max(Math.abs(x1), Math.abs(x2)));


    return result;
}

function findAllY(y1, y2) {
    const d = -1;

    let a = 1000;
    let times;

    let result = [];

    do {
        times = simulate(a, y1, y2, 1, false);
        if (times) result.push({ay: a, times });
        a += d;
    } while(a > -1000);


    return result;
}

function simulate(a, x1, x2, d, stop) {
    let x = 0;
    let time = 0;
    let times = [];
    let wasIn = false;
    
    while (true) {
        const isIn = (x >= x1 && x <= x2);
      
        if (isIn) {
            times.push(time);
        }

        if ((!isIn && wasIn) || time > 1000) {
            break;
        }

        x += a;

        if (!stop || Math.abs(a) > 0) {
            a = a - d;
        }

        if (isIn) wasIn = true;

        time++;
    }

    // U.log('max Y', maxx);

    return times.length > 0 ? times : undefined;
}
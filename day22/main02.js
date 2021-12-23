const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data1 = lines.map(x => x.match(/([a-z]+) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)).map(R.tail);
    const data = data1.map(x => [x[0]].concat(x.slice(1).map(Number)));
    
    let areasOn = [];
    
    data.forEach((line) => {
        const [cmd, x1, x2, y1, y2, z1, z2] = line;
        const newArea = R.tail(line);
        U.log(cmd, x1, x2, y1, y2, z1, z2);

        if (areasOn.length === 0) {
            areasOn.push(newArea);
        } else {

            if (cmd === 'on') {
                areasOn = areasOn.map(a => xor(a, newArea)).flat();
                areasOn.push(newArea);
            }

            if (cmd === 'off') {
                areasOn = areasOn.map(a => xor(a, newArea)).flat();
            }
        }

        // U.log(count(areasOn), areasOn);
    });

    // U.log(areasOn);

    return count(areasOn);
}


function and(c1, c2) {
    const x1 = Math.max(c1[0], c2[0]);
    const x2 = Math.min(c1[1], c2[1]);
    const y1 = Math.max(c1[2], c2[2]);
    const y2 = Math.min(c1[3], c2[3]);
    const z1 = Math.max(c1[4], c2[4]);
    const z2 = Math.min(c1[5], c2[5]);

    const r = [ x1, x2, y1, y2, z1, z2 ];

    if (valid(r)) return r;
}

function add(c1, c2) {
    return [xor(c1, c2), [c2]].flat();
}

function xor(c1, c2) {
    const it = and(c1, c2);

    if (!it) return [c1];

    // U.log('intersection', it);    

    let result = [];

    [[c1[4], it[4]-1], [it[4], it[5]], [it[5]+1, c1[5]]].filter(r => r[0] <= r[1]).forEach(rz => {
        [[c1[2], it[2]-1], [it[2], it[3]], [it[3]+1, c1[3]]].filter(r => r[0] <= r[1]).forEach(ry => {
            [[c1[0], it[0]-1], [it[0], it[1]], [it[1]+1, c1[1]]].filter(r => r[0] <= r[1]).forEach(rx => {
                // U.log(rz, ry, rx);
                result.push([rx, ry, rz].flat());
            })
        });
    });

    const resultValid = result.filter(r => and(r, it) === undefined);

    return resultValid;
}

function valid(c) {
    if (!c) return false;
    return c[0] <= c[1] && c[2] <= c[3] && c[4] <= c[5];
}

function count(areas) {
    const parts = areas.map(a => {
        const w = 1 + a[1] - a[0];
        const h = 1 + a[3] - a[2];
        const d = 1 + a[5] - a[4];

        return w * h * d;
    })

    return parts.reduce(R.add, 0);
}
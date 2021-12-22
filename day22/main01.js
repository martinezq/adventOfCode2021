const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data1 = lines.map(x => x.match(/([a-z]+) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)).map(R.tail);
    const data = data1.map(x => [x[0]].concat(x.slice(1).map(Number)));
    
    let cubesOn = [];
    
    data.forEach((line) => {
        const [cmd, x1, x2, y1, y2, z1, z2] = line;

        U.log(cmd, x1, x2, y1, y2, z1, z2);

        let toAdd = [];
        // let toDel = [];

        if (cmd === 'on') {
            for (let i=x1; i<=x2; i++) {
                if (i < -50 || i > 50) break;

                const a1 = cubesOn.filter(c => c[0] === i);

                for (let j=y1; j<=y2; j++) {
                    if (j < -50 || j > 50) break;
                    
                    const a2 = a1.filter(c => c[1] === j);

                    for (let k=z1; k<=z2; k++) {
                        if (k < -50 || k > 50) break;

                        if (!a2.find(c => c[2] === k)) {
                            const cube = [i, j, k];
                            toAdd.push(cube);
                        }
                    }
                }
            }

            toAdd.forEach(c => cubesOn.push(c));
        }

        if (cmd === 'off') {
            cubesOn = cubesOn.filter(c => {
                const [x, y, z] = c;
                if (x < x1 || x > x2) return true;
                if (y < y1 || y > y2) return true;
                if (z < z1 || z > z2) return true;
                return false;
            });
        }


        // U.log(cubesOn.length, cubesOn);
    });

    U.log(cubesOn);

    return cubesOn.length;
}

function and(c1, c2) {

}

function xor(c1, c2) {

}

function intersectionPoints(c1, c2) {
    let result = [];

    const c1c = corners(c1);

    return result;
}

function pointInside(c, p) {
    return (c[0] >= p[0] <= c[1]) && (c[2] >= p[1] <= c[3]) && (c[4] >= p[2] <= c[5]);
}

function corners(c) {
    return [
        [c[0], c[2], c[4]],
        [c[0], c[2], c[5]],
        [c[0], c[3], c[4]],
        [c[0], c[3], c[5]],
        [c[1], c[2], c[4]],
        [c[1], c[2], c[5]],
        [c[1], c[3], c[4]],
        [c[1], c[3], c[5]]
    ];
}

/*
    data.forEach((line) => {
        const [cmd, x1, x2, y1, y2, z1, z2] = line;

        U.log(cmd, x1, x2, y1, y2, z1, z2);

        let toAdd = [];

        for (let i=x1; i<=x2; i++) {
            for (let j=y1; j<=y2; j++) {
                for (let k=z1; k<=z2; k++) {
                    const cube = [i, j, k];
                    const idx = cubesOn.findIndex(c => c[0] === cube[0] && c[1] === cube[1] && c[2] === cube[2]);
                    const exist = idx > -1;

                    if (cmd === 'on' && !exist) {
                        toAdd.push(cube);
                    }

                    if (cmd === 'off' && exist) {
                        // cubesOn = cubesOn.slice(0, idx).concat(cubesOn.slice(idx + 1));
                    }

                }
            }
        }

        cubesOn = cubesOn.concat(toAdd);

        // U.log(cubesOn.length, cubesOn);
    });
*/
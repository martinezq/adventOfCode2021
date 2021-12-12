const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines.map(line => line.split('').map(Number))

    U.logm(data);
    let result = data;
    let total = 0;

    const totLen = data.flat().length;
    let i = 0;

    for (; i < 2000; i++) {
        U.log('Step', i);
        result = step(result);
        const count = filterMatrix(result, v => v === 0).length;
        total += count
        // U.logm(result)
        U.log('flashes', count);

        if (count === totLen) break;
    }

    return i + 1;
}

function step(input) {
    let s1 = mapMatrix(input, v => v + 1 > 9 ? -1 : v + 1);

    let stop = true;

    do {
        stop = true;
        mapMatrix(s1, (v, x, y) => {
            if (s1[x][y] <= 0) return;
            
            const n = [
                s1[x-1]?.[y-1],
                s1[x-1]?.[y],
                s1[x-1]?.[y+1],
                s1[x]?.[y-1],
                s1[x]?.[y+1],
                s1[x+1]?.[y-1],
                s1[x+1]?.[y],
                s1[x+1]?.[y+1]
            ];

            const n0 = n.filter(v => v === -1);
            s1[x][y] += n0.length;
        });

        s1 = mapMatrix(s1, v => v === -1 ? 0 : v);
        s1 = mapMatrix(s1, v => v > 9 ? -1 : v);
        stop = filterMatrix(s1, v => v === -1).length === 0;
    } while (!stop);

    return s1;
}

// ------------------------------

function mapMatrix(matrix, f) {
    return matrix.map((row, i) => row.map((v, j) => f(v, i, j)));
}

function filterMatrix(matrix, f) {
    return matrix.flat().filter(f);
}
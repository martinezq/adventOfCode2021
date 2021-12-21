const R = require('ramda');
const U = require('./utils');

// const COMBINATIONS = [1, 2];
const COMBINATIONS = generateDiceCombinations();

let cache = {};

U.runWrapper(run);

// --------------------------------------------


function run(lines) {
    const data = lines.map(x => x.match(/Player (\d+) starting position: (\d+)/)).map(x => Number(x[2]));

    U.log(data);

    const wins = play(data);

    return U.maxA(wins);
};




function play(positions, scores, move, p) {
    const key = JSON.stringify({ positions, scores, move, p });

    if (cache[key]) return cache[key];

    // U.log(positions, scores, move, p);

    if (p === undefined) {
        p = 0;
        scores = [0, 0];
    } else {
        positions = positions.map(R.identity);
        positions[p] = 1 + ((positions[p] + move - 1) % 10);

        scores = scores.map(R.identity);
        scores[p] += positions[p];

        if (scores[p] >= 21) {
            const out = scores.map(x => x >= 21 ? 1 : 0);
            cache[key] = out;

            return out;
        }

        p = 1 - p;        
    }

    let totalWins = [0, 0];

    for (let i=0; i<COMBINATIONS.length; i++) {
        const outWins = play(positions, scores, COMBINATIONS[i], p);
        totalWins[0] += outWins[0];
        totalWins[1] += outWins[1];
    }

    cache[key] = totalWins;

    return totalWins;

}

function generateDiceCombinations() {
    const result = [];
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            for (let k=0; k<3; k++) {
                result.push((i+1)+(j+1)+(k+1));
            }
        }    
    }

    return result;
}

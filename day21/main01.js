const R = require('ramda');
const U = require('./utils');

let diceValue = 99;

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines.map(x => x.match(/Player (\d+) starting position: (\d+)/)).map(x => Number(x[2]));

    U.log(data);

    let scores = R.times(x => 0, data.length);
    let positions = data;
    let end = false;
    let rolls = 0;

    for (let i=0; i<2000; i++) {
        if (end) break;

        for (let p=0; p<data.length; p++) {
            const move = rollDice() + rollDice() + rollDice();
            rolls += 3;
            positions[p] = (positions[p] - 1 + move) % 10 + 1;
            scores[p] += positions[p];

            if (scores.find(s => s >= 1000)) {
                end = true;
                break;
            }
        }

        U.log('round', i);
        U.log('positions', positions);
        U.log('scores', scores);

    }

    const lowerScore = scores.find(s => s < 1000);
    U.log(scores, rolls);
    
    return rolls * lowerScore;
};



function rollDice() {
    
    diceValue = (diceValue + 1) % 100;
    return diceValue + 1;
}
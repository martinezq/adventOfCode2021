const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {

    const points = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4
    }

    
    const result = lines.map(chunk => {
        const index = test(chunk);
        U.log(chunk, index, index > -1 ? chunk[index] : 'ok')
        return {chunk, index};
    });
    
    const correct = result.filter(x => x.index === -1).map(x => x.chunk);
    const parts = correct.map(complete);

    const scores = parts
        .map(x => x.split('').reduce((p, c) => p * 5 + points[c], 0));

    const mi = Math.floor(scores.length / 2);
    U.log(scores, mi);

    const score = scores.sort((x, y) => x - y)[mi];

    U.logf(parts, score);

    return score;
}

function test(chunk) {
    const OPENING = ['(', '[', '{', '<'];
    const CLOSING = [')', ']', '}', '>'];

    const isOpening = (x) => OPENING.indexOf(x) > -1;
    const isClosing = (x) => CLOSING.indexOf(x) > -1;

    if (isClosing(chunk[0])) return 0;
    
    const result = -1;
    
    let stack = [];
    let i = 1;

    stack.push(chunk[0]);

    while (i < chunk.length) {
        if (isOpening(chunk[i])) stack.push(chunk[i]);
        if (isClosing(chunk[i])) {
            const type = CLOSING.indexOf(chunk[i]);
            const matching = stack.pop();
            const matchingType = OPENING.indexOf(matching);

            if (type !== matchingType || !isOpening(matching)) {
                return i;
            }
        }
        i++;
    }
    
    return result;
}

function complete(chunk) {
    const OPENING = ['(', '[', '{', '<'];
    const CLOSING = [')', ']', '}', '>'];

    const isOpening = (x) => OPENING.indexOf(x) > -1;
    const isClosing = (x) => CLOSING.indexOf(x) > -1;

    if (isClosing(chunk[0])) return 0;
   
    let stack = [];
    let i = 1;

    stack.push(chunk[0]);

    while (i < chunk.length) {
        if (isOpening(chunk[i])) stack.push(chunk[i]);
        if (isClosing(chunk[i])) {
            const type = CLOSING.indexOf(chunk[i]);
            const matching = stack.pop();
            const matchingType = OPENING.indexOf(matching);

            if (type !== matchingType || !isOpening(matching)) {
                return i;
            }
        }
        i++;
    }
    
    return R.reverse(stack).map(x => CLOSING[OPENING.indexOf(x)]).join('');
}
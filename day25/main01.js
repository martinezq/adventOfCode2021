const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const TYPES = ['>', 'v'];
    const data = lines.map(l => l.split(''));
      
    let board = data;

    let moves = Number.POSITIVE_INFINITY;
    let steps = 0;
    let type = 0;
    
    print(board);

    while (moves > 0) {
        moves = step(board, '>');
        moves += step(board, 'v');
        
        U.log(steps);
        // print(board);

        steps++;
    }

    return steps;
}

function step(board, type) {
    const w = board[0].length;
    const h = board.length;

    let moves = 0;
    
    let moveList = [];

    for (let j=0; j<h; j++) {
        for (let i=0 ;i<w; i++) {
        
            const c = board[j][i];

            if (c !== type) continue;

            if (type === '>') {
                if (board[j][(i+1)%w] === '.') {
                    moveList.push([i, j]);
                    i++;
                }
            } else {
                if (board[(j+1)%h][i] === '.') {
                    moveList.push([i, j]);
                }
            }
        }
    }

    moveList.forEach(m => {
        const [i, j] = m;

        if (type === '>') {
            board[j][(i+1)%w] = type;
            board[j][i] = '.';
            moves++;
        } else {
            board[(j+1)%h][i] = type;
            board[j][i] = '.';
            moves++;
        }
    })

    return moves;
}


function print(data) {
    U.log(U.matrixToTile(data));
}
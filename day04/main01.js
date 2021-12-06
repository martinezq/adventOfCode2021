const fs = require('fs');

const file = fs.readFileSync('input.txt').toString();
const lines = file.split('\n');

const numbers = lines[0].split(',').map(Number);
const boardCount = Math.floor((lines.length - 1) / 6);

// console.log(boardCount);

const boards = Array.from({length: boardCount}, (_, i) => makeBoard(lines, i*6 + 2));

let game = boards;
let index = 0;
let winner = null;

do {
    game = game.map(b => doCheck(b, numbers[index]));
    const winners = game.filter(isWinner);
    winner = winners.length > 0 ? winners[0] : undefined;
    // console.log(index, JSON.stringify(game, null, 2));
    index++;
} while (!winner && index < numbers.length);

const numberWon = numbers[index-1];
const boardScore = calculateBoardScore(winner);

console.log(numberWon, boardScore, numberWon * boardScore);


// --------------------

function row(str) {
    return str
        .replace(/^\s/,'')
        .replaceAll('  ', ' ')
        .split(' ')
        .map(Number)
        .map(x => ({ value: x, checked: false }));
}

function makeBoard(lines, from) {
    return [
        row(lines[from]),
        row(lines[from+1]),
        row(lines[from+2]),
        row(lines[from+3]),
        row(lines[from+4]),
    ].flat();
}

function doCheck(board, value) {
    board.forEach(x => {
        if (x.value === value) x.checked = true;
    });
    return board;
}

function isWinner(board) {
    return false ||
        getRow(board, 0).every(isChecked) ||
        getRow(board, 1).every(isChecked) ||
        getRow(board, 2).every(isChecked) ||
        getRow(board, 3).every(isChecked) ||
        getRow(board, 4).every(isChecked) ||
        getCol(board, 0).every(isChecked) ||
        getCol(board, 1).every(isChecked) ||
        getCol(board, 2).every(isChecked) ||
        getCol(board, 3).every(isChecked) ||
        getCol(board, 4).every(isChecked);

}

function getRow(board, r) {
    return board.slice(r*5, r*5 + 5);
}

function getCol(board, c) {
    return board.filter((v, i) => i % 5 === c);
}


function isChecked(x) {
    return x.checked === true;
}

function calculateBoardScore(board) {
    return board.filter(x => !x.checked).map(x => x.value).reduce((p, c) => p + c, 0);
}
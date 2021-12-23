const R = require('ramda');
const U = require('./utils');

const DESTINATIONS = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3
}

const COSTS = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000
}

const CROSS = [2, 4, 6, 8];

const HALL_OFFSET = 100;

let globalBestCost = Number.POSITIVE_INFINITY;
let globalBestGame;

let cache = {};

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data1 = lines.map(l => l.match(/\#([A-Z])\#([A-Z])\#([A-Z])\#([A-Z])\#/)).filter(R.identity);
    const data = data1.map(R.tail);
    
    // U.log(data);

    let amphs = data.flat().map((d, i) => ({ type: d, cost: 0, hall: undefined, room: i % 4, roomOrder: Math.floor(i / 4), done: false }));
    
    amphs.filter(a => a.roomOrder === 3).forEach(a => a.done = a.room === DESTINATIONS[a.type]);

    for (let i=2; i>=0; i--) {
        let p = amphs.filter(a => a.roomOrder === i+1);
        amphs.filter(a => a.roomOrder === i).forEach((a, j) => a.done = (a.room === DESTINATIONS[a.type] && p[j].done));
    }

    const game = {
        hall: R.times(_ => '.', 11),
        rooms: [
            R.times(i => !amphs[i*4].done ? amphs[i*4].type : 'X', 4),
            R.times(i => !amphs[i*4+1].done ? amphs[i*4+1].type : 'X', 4),
            R.times(i => !amphs[i*4+2].done ? amphs[i*4+2].type : 'X', 4),
            R.times(i => !amphs[i*4+3].done ? amphs[i*4+3].type : 'X', 4)
        ],
        cost: 0,
        done: false
    }

    U.log(game);

    U.log('---');

    play(game);

    U.log('---');

    let p = globalBestGame;

    while(p) {
        U.log(R.omit(['_prev'], p));
        p = p._prev;
    }

    

    return globalBestCost;
}

function play(game, level) {
    // U.log(game);

    level = level || 0;

    // if (level > 15) return game;

    if (game.done) {
        // U.log(game);
    }

    if (game.done && game.cost <= globalBestCost) {
        globalBestCost = game.cost;
        globalBestGame = game;
        U.log(globalBestCost, level);
        // U.log(game);
    }

    let games = nextStep(game).filter(g => g.cost < globalBestCost);

    return games.map(g => play(g, level + 1)).flat();
}

function nextStep(game) {
    const result = [];

    game.rooms.forEach((room, rindex) => {
        const amph = R.head(room);
        if (amph === 'X' || !amph) return;

        // go from room to room
        do {
            const r = DESTINATIONS[amph];

            if (r === rindex) break;
            if (game.rooms[r].length >= 4) return;

            if (game.rooms[r].some(x => x !== 'X')) return;

            let h = CROSS[r];

            let steps = 5 - room.length;
            let hi = CROSS[rindex];
            let d = Math.sign(h - hi);

            while(hi !== h) {
                if (game.hall[hi] !== '.') {
                    hi = -1;
                    return;
                }

                hi += d;
                steps++;
            }

            if (hi === -1) return;

            steps += (4 - game.rooms[r].length);

            const cost = COSTS[amph] * steps;

            let game2 = {
                hall: game.hall,
                rooms: game.rooms.map((x, ii) => x === room ? R.tail(x) : ii === r ? ['X'].concat(x) : x),
                cost: game.cost + cost,
                _prev: game
            };

            const roomsFlat = game2.rooms.flat();
            game2.done = roomsFlat.length === 16 && roomsFlat.every(x => x === 'X');

            result.push(game2);

        } while(false);
    });

    game.rooms.forEach((room, rindex) => {
        const amph = R.head(room);
        if (amph === 'X' || !amph) return;

        // go from room to hall
        for (let h=0; h<11; h++) {
            if (h === 2 || h === 4 || h === 6 || h === 8) continue;
            if (game.hall[h] !== '.') continue;

            let steps = 5 - room.length;
            let hi = CROSS[rindex];
            let d = Math.sign(h - hi);

            while(hi !== h) {
                if (game.hall[hi] !== '.') {
                    hi = -1;
                    break;
                }

                hi += d;
                steps++;
            }

            if (hi === -1) break;

            const cost = COSTS[amph] * steps;

            let game2 = {
                hall: game.hall.map((x, ii) => ii === h ? amph : x),
                rooms: game.rooms.map((x, ii) => x === room ? R.tail(x) : x),
                cost: game.cost + cost,
                _prev: game
            }

            const roomsFlat = game2.rooms.flat();
            game2.done = roomsFlat.length === 16 && roomsFlat.every(x => x === 'X');

            result.push(game2);
        }
    });

    // go from hall to room
    game.hall.forEach((amph, hindex) => {
        if (amph === '.') return;

        const r = DESTINATIONS[amph];
        const h = CROSS[r];

        if (game.rooms[r].some(x => x !== 'X')) return;

        let steps = 0
        let hi = hindex;
        let d = Math.sign(h - hi);

        while(hi !== h) {
            if (hi !== hindex && game.hall[hi] !== '.') {
                hi = -1;
                break;
            }

            hi += d;
            steps++;
        }

        if (hi === -1) return;

        steps += (4 - game.rooms[r].length);

        const cost = COSTS[amph] * steps;

        let game2 = {
            hall: game.hall.map((x, ii) => ii === hindex ? '.' : x),
            rooms: game.rooms.map((x, ii) => ii === r ? ['X'].concat(x) : x),
            cost: game.cost + cost,
            _prev: game
        }

        const roomsFlat = game2.rooms.flat();
        game2.done = roomsFlat.length === 16 && roomsFlat.every(x => x === 'X');

        result.push(game2);        
    })


    return result;
}
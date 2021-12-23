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

const ROOM_TO_HALL_ABOVE = [
    2, 4, 6, 8
]

const ORDER = R.times(R.identity, 16).sort((x, y) => Math.random() - 0.5);
const ORDER2 = R.times(R.identity, 11).sort((x, y) => Math.random() - 0.5);

let globalBest = Number.POSITIVE_INFINITY;
let cache = {};

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data1 = lines.map(l => l.match(/\#([A-Z])\#([A-Z])\#([A-Z])\#([A-Z])\#/)).filter(R.identity);
    const data = data1.map(R.tail);
    
    // U.log(data);

    let amphs1 = data.flat().map((d, i) => ({ type: d, hall: undefined, room: i % 4, roomOrder: Math.floor(i / 4), done: false }));
    
    amphs1.filter(a => a.roomOrder === 3).forEach(a => a.done = a.room === DESTINATIONS[a.type]);

    for (let i=2; i>=0; i--) {
        let p = amphs1.filter(a => a.roomOrder === i+1);
        amphs1.filter(a => a.roomOrder === i).forEach((a, j) => a.done = (a.room === DESTINATIONS[a.type] && p[j].done));
    }

    let amphs = {
        totalCost: 0,
        list: amphs1,
        hallUsage: Array.from({ length: 11 }, _ => false),
        roomUsage: [4, 4, 4, 4]
    }

    amphs.key = makeKey(amphs);

    U.log(amphs);

    U.log('---');

    // let tmp = amphs;

    // U.log('---');
    // tmp = moveToHall(tmp, tmp[2], 3);
    // tmp.forEach(a => U.log(a));

    // U.log('---');
    // tmp = moveToHall(tmp, tmp[1], 6);
    // tmp.forEach(a => U.log(a));

    // U.log('---');
    // tmp = moveToRoom(tmp, tmp[1], 2);
    // tmp.forEach(a => U.log(a));

    // U.log('---');
    // tmp = moveToRoom(tmp, tmp[1], 0);
    // tmp.forEach(a => U.log(a));

    const x = search(amphs);
    // x.forEach(a => U.log(a));

    return globalBest;
}

function search(amphs) {
    const cost = costOfSolution(amphs);
    
    if (cost > globalBest) {
        return amphs;
    }

    let bestSolution = amphs;
    let bestSolutionCost = Number.POSITIVE_INFINITY;

    for (let i=0; i<amphs.list.length; i++) {
        const index = i;
        const amph = amphs.list[index];

        if (amph.done) continue;

        const key = amphs.key + '_' + index;
        const val = findInCache(key);
        
        let solution;

        if (val) {
            solution = val;
        } else {
            solution = move(amphs, index);        
        }
        
        const solutionCost = costOfSolution(solution);

        if (!val) cache[key] = solution;

        if (solutionCost < bestSolutionCost) {
            bestSolution = solution;
            bestSolutionCost = solutionCost;
        }
    }    

    if (bestSolutionCost < globalBest && isDone(bestSolution)) {
        globalBest = bestSolutionCost;
        U.log(globalBest);
    }

    return bestSolution;
}

function makeKey(amphs) {
    // return JSON.stringify([ amphs.list, amphs.totalCost ]);

    return amphs.list.map(a => `${a.type}${a.room || 'n'}${a.roomOrder || 'n'}${a.hall || 'n'}${a.done ? 1 : 0}`).join('') + amphs.totalCost;
}

function findInCache(key) {
    return cache[key];
}

function move(amphs, index) {
    const cost = costOfSolution(amphs);
    if (cost > globalBest) {
        return amphs;
    }

    const amph = amphs.list[index];

    if (amph.done) return amphs;
    
    let result;

    if (amph.room !== undefined) {
        let bestSolution = undefined;
        let bestSolutionCost = Number.POSITIVE_INFINITY;

        const step = moveToRoomFromRoom(amphs, index, DESTINATIONS[amph.type])
            
        if (step) {
            const solution = search(step);
            const solutionCost = costOfSolution(solution);
    
            if (solutionCost < bestSolutionCost) {
                bestSolution = solution;
                bestSolutionCost = solutionCost;
            }
        }            


        for (let hi=0; hi<11; hi++) {
            const h = ORDER2[hi];
            
            if (ROOM_TO_HALL_ABOVE.indexOf(h) > -1) continue;

            const step = moveToHall(amphs, index, h);
            
            if (step) {
                const solution = search(step);

                if (solution !== undefined) {
                    const solutionCost = costOfSolution(solution);
    
                    if (solutionCost < bestSolutionCost) {
                        bestSolution = solution;
                        bestSolutionCost = solutionCost;
                    }
                }
            }
        }
        // U.log('#', bestSolutionCost);
        // U.log(bestSolution);

        result = bestSolution;

    } else {
        const result1 = moveToRoomFromHall(amphs, index);
        result = result1 ? search(result1) : undefined;
    }

    return result;
}

function moveToHall(amphs, index, hall) {
    if (!amphs) return;

    const amph = amphs.list[index];
    const cost = costOfMoveToHall(amphs, index, hall);
                
    if (cost !== undefined) {
        const newAmph = { ...amph, hall: hall, room: undefined, roomOrder: undefined };

        let result = {
            totalCost: amphs.totalCost + cost,
            list : amphs.list.map((a, i) => i !== index ? a : newAmph),
            hallUsage: amphs.hallUsage.map((u, i) => i === newAmph.hall ? true : u),
            roomUsage: amphs.roomUsage.map((r, i) => i === amph.room ? r - 1 : r)
        };

        result.key = makeKey(result);

        return result;
    }
}

function moveToRoomFromRoom(amphs, index) {
    if (!amphs) return;

    const amph = amphs.list[index];

    const room = DESTINATIONS[amph.type];
    const amphsInRoom = amphs.roomUsage[room];
    if (amphsInRoom >= 4) return;

    if (amphs.list.find(a => a.room === room && a.done !== true)) return;

    const cost1 = costOfMoveToHall(amphs, index, ROOM_TO_HALL_ABOVE[room]);

    if (cost1 !== undefined) {
        const cost = cost1 + (4 - amphsInRoom) * COSTS[amph.type];
        const newAmph = { ...amph, hall: undefined, room: room, roomOrder: 3 - amphsInRoom, done: true};

        const result = {
            totalCost: amphs.totalCost + cost,
            list : amphs.list.map((a, i) => i !== index ? a : newAmph),
            hallUsage: amphs.hallUsage,
            roomUsage: amphs.roomUsage.map((r, i) => i === newAmph.room ? r + 1 : (i === amph.room ? r -1 : r))
        };

        result.key = makeKey(result);

        return result;
    }
}

function moveToRoomFromHall(amphs, index) {
    if (!amphs) return;

    const amph = amphs.list[index];

    const room = DESTINATIONS[amph.type];
    const cost = costOfMoveToRoom(amphs, index, room);

    if (cost !== undefined) {
        const amphsInRoom = amphs.roomUsage[room];
        const newAmph = { ...amph, hall: undefined, room: room, roomOrder: 3 - amphsInRoom, done: true};

        const result = {
            totalCost: amphs.totalCost + cost,
            list : amphs.list.map((a, i) => i !== index ? a : newAmph),
            hallUsage: amphs.hallUsage.map((u, i) => i === amph.hall ? false : u),
            roomUsage: amphs.roomUsage.map((r, i) => i === newAmph.room ? r + 1 : r)
        };

        result.key = makeKey(result);

        return result;
    }
}

function costOfMoveToHall(amphs, index, hall) {
    const amph = amphs.list[index];

    if (amph.done) return;
    if (amph.hall !== undefined) return;

    if (amph.roomOrder !== 4 - amphs.roomUsage[amph.room]) {
        return;
    }
    
    if (amphs.hallUsage[hall] || amphs.hallUsage[ROOM_TO_HALL_ABOVE[amph.room]]) return;

    let cost = (amph.roomOrder + 1) * COSTS[amph.type];

    let hi = ROOM_TO_HALL_ABOVE[amph.room];

    const d = Math.sign(hall - hi);

    while(hi !== hall) {
        if (hi < 0 || (hi > 10)) return;
        if (amphs.hallUsage[hi] && amph.hall !== hi) return;
        
        hi += d;
        cost += COSTS[amph.type];
    }

    return cost;
}

function costOfMoveInHall(amphs, index, hall) {
    const amph = amphs.list[index];
    if (amph.room !== undefined) return;

    let cost = 0;

    if (amphs.hallUsage[hall]) return;

    let hi = amph.hall;
    const d = Math.sign(hall - hi);

    while(hi !== hall) {
        if (hi < 0 || (hi > 10)) return;
        
        if (amphs.hallUsage[hi] && amph.hall !== hi) return;
        
        hi += d;
        cost += COSTS[amph.type];
    }

    return cost;
}

function costOfMoveToRoom(amphs, index, room) {
    const amph = amphs.list[index];

    if (amph.done) return;
    if (amph.room !== undefined) return;

    let cost = costOfMoveInHall(amphs, index, ROOM_TO_HALL_ABOVE[room]);

    if (cost === undefined) return;

    const amphsInRoom = amphs.list.reduce((p, c) => c.room === room ? p + 1 : p, 0)

    if (amphsInRoom >= 4) return;
    cost += (4 - amphsInRoom) * COSTS[amph.type];
    

    return cost;
}

function costOfSolution(amphs) {
    if (!amphs) return Number.POSITIVE_INFINITY;
    return amphs.totalCost;
}

function isDone(amphs) {
    return amphs.list.every(a => a.done);
}
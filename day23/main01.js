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

const ORDER = R.times(R.identity, 8).sort((x, y) => Math.random() - 0.5);
const ORDER2 = R.times(R.identity, 11).sort((x, y) => Math.random() - 0.5);

let globalBest = Number.POSITIVE_INFINITY;
let cache = {};

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data1 = lines.map(l => l.match(/\#([A-Z])\#([A-Z])\#([A-Z])\#([A-Z])\#/)).filter(R.identity);
    const data = data1.map(R.tail);
    
    // U.log(data);

    const amphs1 = data.flat().map((d, i) => ({ type: d, cost: 0, hall: undefined, room: i % 4, roomOrder: Math.floor(i / 4), done: false }));
    const amphs2 = amphs1.map(a => ({ ...a, done: DESTINATIONS[a.type] === a.room && a.roomOrder === 1 }));
    const amphs3  = amphs2.map(a => ({ ...a, done: a.done || (DESTINATIONS[a.type] === a.room && a.roomOrder === 0 && Boolean(amphs2.find(a2 => a2.room === a.room && a2.type === a.type && a2.done))) }));

    const amphs = {
        totalCost: 0,
        list: amphs3,
        hallUsage: Array.from({ length: 11 }, _ => false)
    }

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

    const key1 = makeKey(amphs)

    for (let i=0; i<amphs.list.length; i++) {

        const index = ORDER[i];
        const key = key1 + '_' + index;
        const val = findInCache(key);
        if (val) return val;
    
        const solution = move(amphs, index);        
        const solutionCost = costOfSolution(solution);

        cache[key] = solution;

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
    return JSON.stringify(amphs.list);
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
        let bestSolution = amphs;
        let bestSolutionCost = Number.POSITIVE_INFINITY; // costOfSolution(bestSolution);

        const step0 = moveToHall(amphs, index, ROOM_TO_HALL_ABOVE[amph.room]);

        if (step0) {
            const step1 = moveToRoom(step0, index, DESTINATIONS[step0.list[index].type])
            
            if (step1) {
                const solution = search(step1);
                const solutionCost = costOfSolution(solution);
        
                if (solutionCost < bestSolutionCost) {
                    bestSolution = solution;
                    bestSolutionCost = solutionCost;
                }
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
        const result1 = moveToRoom(amphs, index);
        result = result1 ? search(result1) : amphs;
    }

    // cache[key] = result;

    return result;
}

function moveToHall(amphs, index, hall) {
    if (!amphs) return;

    const amph = amphs.list[index];
    const cost = costOfMoveToHall(amphs, index, hall);
                
    if (cost !== undefined) {
        const newAmph = { ...amph, cost: amph.cost + cost, hall: hall, room: undefined, roomOrder: undefined };
    
        let newHallUsage = R.clone(amphs.hallUsage);
        newHallUsage[newAmph.hall] = true;

        return {
            totalCost: amphs.totalCost + cost,
            list : amphs.list.map((a, i) => i !== index ? a : newAmph),
            hallUsage: newHallUsage
        };
    }
}

function moveToRoom(amphs, index) {
    if (!amphs) return;

    const amph = amphs.list[index];

    const room = DESTINATIONS[amph.type];
    const cost = costOfMoveToRoom(amphs, index, room);

    if (cost !== undefined) {
        const amphsInRoom = amphs.list.reduce((p, c) => c.room === room ? p + 1 : p, 0)
        const newAmph = { ...amph, cost: amph.cost + cost, hall: undefined, room: room, roomOrder: 1 - amphsInRoom, done: true};
        
        let newHallUsage = R.clone(amphs.hallUsage);
        newHallUsage[amph.hall] = false;

        return {
            totalCost: amphs.totalCost + cost,
            list : amphs.list.map((a, i) => i !== index ? a : newAmph),
            hallUsage: newHallUsage
        };
    }
}

function costOfMoveToHall(amphs, index, hall) {
    const amph = amphs.list[index];

    if (amph.done) return;
    if (amph.hall !== undefined) return;

    if (amph.roomOrder === 1) {
        const x = amphs.list.find(a => (a !== amph) && (a.room === amph.room && a.roomOrder === 0));
        if (x) return;
    }

    
    // if (amphs.list.find(a => (a !== amph) && ((a.hall === hall) || (a.hall === ROOM_TO_HALL_ABOVE[amph.room])))) return;
    if (amphs.hallUsage[hall] || amphs.hallUsage[ROOM_TO_HALL_ABOVE[amph.room]]) return;

    let cost = amph.roomOrder === 0 ? COSTS[amph.type] : COSTS[amph.type] * 2;

    let hi = ROOM_TO_HALL_ABOVE[amph.room];

    const d = Math.sign(hall - hi);

    while(hi !== hall) {
        if (hi < 0 || (hi > 10)) return;
        // if (amphs.list.find(a => (a !== amph) && (a.hall === hi))) return;
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

    // if (amphs.list.find(a => (a !== amph) && (a.hall === hall))) return;
    if (amphs.hallUsage[hall]) return;

    let hi = amph.hall;
    const d = Math.sign(hall - hi);

    while(hi !== hall) {
        if (hi < 0 || (hi > 10)) return;
        
        // if (amphs.list.find(a => (a !== amph) && (a.hall === hi))) return;
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

    // const amphsInRoom = amphs.list.filter(a => (a !== amph) && (a.room === room)).length;
    const amphsInRoom = amphs.list.reduce((p, c) => c.room === room ? p + 1 : p, 0)

    if (amphsInRoom >= 2) return;
    if (amphsInRoom === 1) cost += COSTS[amph.type];
    if (amphsInRoom === 0) cost += 2 * COSTS[amph.type];

    return cost;
}

function costOfSolution(amphs) {
    return amphs.totalCost;

    // if (!amphs) return Number.POSITIVE_INFINITY;
    // const x = amphs.list.map(a => a.done ? a.cost : 0);
    // return x.reduce(R.add, 0);
}

function isDone(amphs) {
    return amphs.list.every(a => a.done);
}
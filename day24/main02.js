const R = require('ramda');
const U = require('./utils');

let best = Number.POSITIVE_INFINITY;
let cache = {};

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines.map(l => l);

    const data1 = data.map(l => l.match(/([a-z]+)\s([a-z])(\s(.*))?/))
    const commands = data1.map(c => ({
        code: c[1],
        left: c[2],
        right: Number(c[4]) || c[4]
    }));

    let codes = [];
    let buf = [];

    commands.forEach(cmd => {
        if (cmd.code === 'inp') {
            if (buf.length > 0) {
                codes.push(buf);
            }
            buf = [cmd];
        } else {
            buf.push(cmd);
        }
    });

    codes.push(buf);

    // U.log(data, commands);

    const funcs = codes.map(code => {
        const func = compile(code);
        return func;
    });

    const result = solve(funcs);

    // return result;

}

function solve(funcs, level, presult, value) {
    value = value || '';
    level = level || 0;
    presult = presult || 0;
    
    if (level > 13) {
        if (presult < best) {
            best = presult;
            U.log(value, level, presult);
        }
        return;
    }

    const func = funcs[level];

    for (let i=1; i<=9; i++) {
        const fresult = func(i, presult);

        if (fresult > 1000000) continue;

        solve(funcs, level + 1, fresult, value + i);
    }

}


function compile(commands) {
    let code = [
        'let w=0; x=0, y=0, z = zin !== undefined ? zin : 0;'
    ];

    commands.forEach(cmd => {

        switch (cmd.code) {
            case 'inp':
                // code.push(`console.log(${inputIndex}, w, x, y, z);`);
                code.push(`${cmd.left} = digit;`);
                break;
            case 'add':
                code.push(`${cmd.left} = ${cmd.left} + ${cmd.right};`);
                break;
            case 'mul':
                code.push(`${cmd.left} = ${cmd.left} * ${cmd.right};`);
                break;
            case 'div':
                code.push(`${cmd.left} = Math.floor(${cmd.left} / ${cmd.right});`);
                break;
            case 'mod':
                code.push(`${cmd.left} = ${cmd.left} % ${cmd.right};`);
                break;
            case 'eql':
                code.push(`${cmd.left} = ${cmd.left} === ${cmd.right} ? 1 : 0;`)
                break;
        }

        // U.log(cmd, memory, input, inputIndex);
    });

    // code.push('console.log(input, w, x, y, z);');
    code.push('return z');

    return Function('digit', 'zin', code.join('\n'));
}

function compile2(commands) {
    let code = [
        'let w=0; x=0, y=0, z=0;'
    ];

    let inputIndex = 0;

    commands.forEach(cmd => {

        // const decodedRight = typeof cmd.right === 'number' ? cmd.right : memory[cmd.right];

        switch (cmd.code) {
            case 'inp':
                //memory[cmd.left] = input[inputIndex++];
                // code.push(`console.log(${inputIndex}, w, x, y, z);`);
                code.push(`${cmd.left} = input[${inputIndex++}];`);
                break;
            case 'add':
                // memory[cmd.left] = memory[cmd.left] + decodedRight;
                code.push(`${cmd.left} = ${cmd.left} + ${cmd.right};`);
                break;
            case 'mul':
                // memory[cmd.left] = memory[cmd.left] * decodedRight;
                code.push(`${cmd.left} = ${cmd.left} * ${cmd.right};`);
                break;
            case 'div':
                // memory[cmd.left] = Math.floor(memory[cmd.left] / decodedRight);
                code.push(`${cmd.left} = Math.floor(${cmd.left} / ${cmd.right});`);
                break;
            case 'mod':
                // memory[cmd.left] = memory[cmd.left] % decodedRight;
                code.push(`${cmd.left} = ${cmd.left} % ${cmd.right};`);
                break;
            case 'eql':
                // memory[cmd.left] = (memory[cmd.left] === decodedRight) ? 1 : 0
                code.push(`${cmd.left} = ${cmd.left} === ${cmd.right} ? 1 : 0;`)
                break;
        }

        // U.log(cmd, memory, input, inputIndex);
    });

    // code.push('console.log(input, w, x, y, z);');
    code.push('return z');

    return Function('input', code.join('\n'));
}
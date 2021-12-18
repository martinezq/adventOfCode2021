const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines.map(l => JSON.parse(l));

    let max = Number.NEGATIVE_INFINITY;

    for (let i=0; i<data.length; i++) {
        for (let j=0; j<data.length; j++) {
            if (i != j) {
                const mag = magnitude(reduce(add(data[i], data[j])));
                // U.log(mag);
                if (mag > max) max = mag;
            }
        }
    }

    // U.log(result);

    return max;
}

function add(a, b) {
    return [a, b];
}

function reduce(a) {
    let tree = toBinaryTree(a);
    let change = false;

    do {
        // U.log('input  ', toArray(tree))
        
        change = explode(tree);
        // U.log('explode', toArray(tree))
        
        if (!change) {
            change = split(tree);
            // U.log('split  ', toArray(tree))
        }

    } while(change);

    
    return toArray(tree);
}

function magnitude(tree) {
    if (Array.isArray(tree)) tree = toBinaryTree(tree);
    if (tree.value !== undefined) return tree.value;

    return magnitude(tree.children[0]) * 3 + magnitude(tree.children[1]) * 2;
}

function toBinaryTree(data) {
    if (typeof data === 'number') {
        return { value: data }
    }

    let node = {
        children: data.map(x => toBinaryTree(x))
    };

    node.children.forEach((c, i) => {
        c.parent = node;
        c.index = i;
    });

    return node;
}

function toArray(tree) {
    if (tree === undefined) return undefined;

    if (tree.value !== undefined) return tree.value;

    return tree.children.map(toArray);
}

function indexOfValues(tree) {
    if (tree === undefined) return undefined;
    if (tree.value !== undefined) return tree;

    return tree.children.map(indexOfValues).flat();
}

function explode(tree) {
    const node = findNodeToExplode(tree, 0);

    if (node) {
        // U.log(toArray(node));

        const l = node.children[0].value
        const r = node.children[1].value

        node.children = undefined;
        node.value = 0;

        const valueArray = indexOfValues(tree);

        const indexInArray = valueArray.findIndex(x => x === node);

        if (indexInArray > 0) {
            valueArray[indexInArray - 1].value += l;
        }

        if (indexInArray < valueArray.length - 1) {
            valueArray[indexInArray + 1].value += r;
        }

        return true;

    }

    return false;

}

function split(tree) {
    if (tree.value > 9) {
        const a = Math.floor(tree.value / 2);
        const b = tree.value - a;
        tree.children = [
            { value: a, parent: tree},
            { value: b, parent: tree}
        ];
        tree.value = undefined;
        
        return true;
    }

    if (tree.children) {
        for (let i=0; i<tree.children.length; i++) {
            const change = split(tree.children[i]);
            if (change) return true;
        }
    }

    return false;
}

function findNodeToExplode(node, level) {
    if (node.value !== undefined) return;
    
    if (level >= 4 && node.children && node.children.every(c => c.value !== undefined)) {
        return node;
    }

    for (let i=0; i<node.children.length; i++) {
        const r = findNodeToExplode(node.children[i], level + 1);
        if (r) return r;
    }
}

// -------------------------------

function explode3(a) {
    const str = JSON.stringify(a);
    let level = 0;
    let buf = '';
    let result = '';

    for (let i = 0; i < str.length; i++) {

        if (parseInt(str[i])) {
            buf = buf + str[i];
        } else if (buf.length > 0) {
            const v = parseInt(buf);
            if (level === 4) {
                result += 'URA';
            } else {
                result += v;
            }
            buf = '';
        }

        if (str[i] === '[') {
            level++;
            result += str[i];
            continue;
        }
        if (str[i] === ']') {
            level++;
            result += str[i];
            continue;
        }

        if (str[i] === ',') {
            result += str[i];
            continue;
        }
        

    }

    return result;
}

function explode2(a) {
    const marked =  markExploded(a, 0);
    const markedStr = JSON.stringify(marked);

    U.log(markedStr);

    const parts = markedStr.match(/([\[\],\d]*)(\d*)([\[\],]*)\[\"explode me\",(\d+),(\d+)\]([\[\],]*)(\d*)(([\[\],\d])*)/);

    U.logf(parts)

    const prefix = parts[1];
    const num1 = 1;
    const replace = 0;
    const num2 = 3;
    const postfix = parts[6];

    const out = [
        prefix,
        num1,
        replace,
        num2,
        postfix
    ];

    U.logf(out);

    return a;

    function markExploded(a, level) {
        // U.log(level, a);

        if (Number.isInteger(a)) {
            return a;
        }

        if (level === 4) {
            return ['explode me'].concat(a);;
        }
        
        const le = markExploded(a[0], level + 1);

        if (le.length === 3) {
            return [ le, a[1] ];
        } else {
            const re = markExploded(a[1], level + 1);
            return [ le, re ];
        }

    }    
    
}
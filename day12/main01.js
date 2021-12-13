const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines.map(line => line.split('-'));
    U.log(data);

    const allCaves = R.uniq(data.map(x => x[0]).concat(data.map(x => x[1])));

    // U.log(validPath(['start', 'a', 'A', 'end'], allCaves));
    // U.log(validPath(['start', 'a', 'b', 'A', 'end'], allCaves));

    const paths = findPaths('end', ['start'], data);
    U.log(paths);

    const total = paths.length;

    return total;


    function findPaths(to, path, data, buf) {
        buf = buf || [];

        // U.log('testing', path, to);
        const last = R.last(path);

        if (last === to) {
            return [path];
        } else {
            const cand = findFrom(last, data);
            const candPaths = cand.map(c => path.concat([c]));
            const validCandPath = candPaths.filter(p => testSmallCaves(p));

            const x = validCandPath.map(p => findPaths(to, p, data)).flat();
            
            const good = x;

            // U.log(good);
            return good;
        }

    }

    function canGo(from, to, data) {
        return Boolean(data.find(d => 
            d[0] === from && d[1] === to ||
            d[1] === from && d[0] === to
        ));
    }

    function findFrom(from, data) {
        const x = data.filter(d => d[0] === from).map(d => d[1]);
        const y = data.filter(d => d[1] === from).map(d => d[0]);
        return R.uniq(x.concat(y)).filter(x => x !== 'start');
    }

    function testSmallCaves(path) {
        const path2 = path.filter(x => x !== 'start' && x !== 'end');
        const groups = R.groupBy(R.identity, path2); 
        const keys = R.keys(groups);

        return keys.filter(x => x.match(/[a-z]+/)).every(k => groups[k].length < 2);
    }

    function validPath(path, all) {
        const path2 = path.filter(x => x !== 'start' && x !== 'end');
        const groups = R.groupBy(R.identity, path2); 
        const keys = R.keys(groups);
        
        const smallCond = keys.filter(x => x.match(/[a-z]+/)).every(k => groups[k].length < 2);

        const bigCond = all.filter(x => x.match(/[A-Z]+/)).every(k => keys.indexOf(k) > -1);

        return smallCond && bigCond;
        }

}
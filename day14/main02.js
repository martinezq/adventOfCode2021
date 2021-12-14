const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines.map(x => x);
    const template = R.head(lines).split('');
    const insertions = R.tail(R.tail(lines))
        .map(x => x.match(/([A-Z]+) -> ([A-Z]+)/))
        .map(x => [x[1], x[2]]);

    let map = {};

    insertions.forEach(ins => {
        map[ins[0]] = ins[1];
    });

    // U.log(map);

    let buf = {};

    for (let i = 0; i < template.length - 1; i++) {
        const part = template[i]+template[i+1];
        buf[part] = buf[part] ? buf[part] + 1 : 1;
    }

    U.log(buf);
    
    
    for (let s=0; s < 40; s++) {
        const keys = R.keys(buf);

        let buf2 = {};

        keys.forEach(k => {
            const replacement = map[k];
            if (replacement) {
                const tmp = buf[k];

                const k2 = k[0] + replacement;
                buf2[k2] = (buf2[k2] || 0) + tmp;

                const k3 = replacement + k[1];
                buf2[k3] = (buf2[k3] || 0) + tmp;

            } else {
                buf2[k] = (buf2[k] || 0) + buf[k];
            }
        });

        buf = buf2;


        U.log(s, buf);
    }

    let countsBuf = {};

    R.keys(buf).forEach(k => {
        const x = k[0];
        const y = k[1];

        countsBuf[x] = countsBuf[x] ? countsBuf[x] + buf[k] : buf[k];
        // countsBuf[y] = countsBuf[y] ? countsBuf[y] + buf[k] : buf[k];
    });

    const counts = R.keys(countsBuf).map(k => [k, countsBuf[k]]);
   
    U.log(counts);

    const countsSorted = R.sortBy(R.prop(1), counts);
    const min = R.head(countsSorted);
    const max = R.last(countsSorted);

    U.log(countsSorted);
    U.log(min, max);

    return max[1] - min[1] + 1;
}
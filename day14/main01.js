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

    U.log(template, map);

    let buf = template;

    for (let s=0; s < 10; s++) {
        let buf2 = [];

        for (let i = 0; i < buf.length - 1; i++) {
            const part = buf[i]+buf[i+1];
            const replacement = map[part];

            // U.log(part, replacement);

            if (replacement) {
                buf2.push(buf[i]);
                buf2.push(replacement);
            } else {
                buf2.push(buf[i]);
            }

            // U.log(buf2);

        }

        buf2.push(R.last(buf));
        buf = buf2;

        U.log(s, buf);
    }

    const groups = R.groupBy(R.identity, buf);
    const keys = R.keys(groups);
    const counts = keys.map(k => [k, groups[k].length]);
   
    const countsSorted = R.sortBy(R.prop(1), counts);
    const min = R.head(countsSorted);
    const max = R.last(countsSorted);

    U.log(countsSorted);
    U.log(min, max);

    return max[1] - min[1];
}
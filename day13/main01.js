const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const folds = lines
        .map(x => x.match(/fold along (x|y)=(\d+)/))
        .filter(R.identity)
        .map(x => ({axis: x[1] === 'x' ? 0 : 1, index: Number(x[2])}));

    const data = lines
        .map(x => x.match(/(\d+),(\d+)/))
        .filter(R.identity)
        .map(x => [Number(x[1]), Number(x[2])]);
    
    // U.log(data);
    // U.log(folds);

    let step = data;

    [folds[0]].forEach(fold => {
        U.log(fold, step);
        step = doStep(step, fold);
    });

    U.log('end', step);

    return step.length;
}

function doStep(data, fold) {
    const p1 = data.filter(x => x[fold.axis] < fold.index);
    const p2 = data.filter(x => x[fold.axis] >= fold.index);

    const width = R.last(data.map(x => x[0]).sort((x, y) => x-y));
    const height = R.last(data.map(x => x[1]).sort((x, y) => x-y));

    U.log(width, height);

    const p2m = p2.map(x => {
        if (fold.axis === 0) {
            return [width - x[0], x[1]]
        }
        if (fold.axis === 1) {
            return [x[0], height - x[1]]
        }
        return x;
    });

    U.log(p1)
    U.log(p2);
    U.log(p2m);
    
    const result = p1.concat(p2m);

    return R.uniqBy(x => `${x[0]},${x[1]}`, result);
}

function print(data) {

}
const R = require('ramda');
const U = require('./utils');
const A = require('./astar');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const matrix = lines.map(x => x.split('').map(Number));


    const matrix2 = matrix.map(row => {
        return row
            .concat(row.map(r => (r % 9) + 1))
            .concat(row.map(r => ((r+1) % 9) + 1))
            .concat(row.map(r => ((r+2) % 9) + 1))
            .concat(row.map(r => ((r+3) % 9) + 1))
    });

    const matrix3 = matrix2
        .concat(U.mapMatrix(matrix2, x => (x % 9) + 1))
        .concat(U.mapMatrix(matrix2, x => ((x+1) % 9) + 1))
        .concat(U.mapMatrix(matrix2, x => ((x+2) % 9) + 1))
        .concat(U.mapMatrix(matrix2, x => ((x+3) % 9) + 1))

    U.logm(matrix3);

    const w = matrix3[0].length;
    const h = matrix3.length;

    const graphWithWeight = new A.Graph(matrix3);
	const startWithWeight = graphWithWeight.grid[0][0];
	const endWithWeight = graphWithWeight.grid[h-1][w-1];
	
    const resultWithWeight = A.astar.search(graphWithWeight, startWithWeight, endWithWeight);


    // U.logm(resultWithWeight);

    return R.last(resultWithWeight).g;
  }
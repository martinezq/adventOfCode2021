const R = require('ramda');
const U = require('./utils');
const A = require('./astar');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const matrix = lines.map(x => x.split('').map(Number));
    const w = matrix[0].length;
    const h = matrix.length;

    // U.logm(matrix);

    const graphWithWeight = new A.Graph(matrix);
	const startWithWeight = graphWithWeight.grid[0][0];
	const endWithWeight = graphWithWeight.grid[h-1][w-1];
	
    const resultWithWeight = A.astar.search(graphWithWeight, startWithWeight, endWithWeight);


    U.logm(resultWithWeight);

    return R.last(resultWithWeight).g;
  }
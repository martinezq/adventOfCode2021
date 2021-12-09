const fs = require('fs');
const R = require('ramda');
const U = require('./utils');

const file = fs.readFileSync(`${__dirname}/input.txt`).toString();

const data = file.split('\r\n').map(x => x.split('').map(Number));

const width = data[0].length;
const height = data.length;

U.log(data);

const flat = data.flat();

U.log(flat, width, height);

const low = flat.map((p, i) => {
    const x = i % width;
    const y = Math.floor(i / width);
    
    const tc = [
        x > 0 ? data[y][x-1] : 99,
        x < width - 1 ? data[y][x+1] : 99,
        y > 0 ?  data[y-1][x] : 99,
        y < height - 1 ? data[y+1][x] : 99
    ];

    const v = tc[0] > p && tc[1] > p && tc[2] > p && tc[3] > p;

    U.log(x, y, p, tc, v);

    return v ? [x, y] : undefined;
}).filter(x => x);

U.log(low);

const basins = low.map(calcBasin);

U.log(basins);

function calcBasin(point) {
    let size = 1;
    let datac = data.map(x => x.map(y => y));

    function checkAround(x, y) {
        const p = datac[y][x];
        datac[y][x] = 99;
        
        if (x > 0 && datac[y][x-1] < 9 && datac[y][x-1] > p) {
            size++;
            checkAround(x-1, y);
        }
        
        if (x < width - 1 && datac[y][x+1] < 9 && datac[y][x+1] > p) {
            size++;
            checkAround(x+1, y);
        }
        
        if (y > 0 &&  datac[y-1][x] < 9 && datac[y-1][x] > p) {
            size++;
            checkAround(x, y-1);
        }
        
        if (y < height - 1 &&  datac[y+1][x] < 9 && datac[y+1][x] > p) {
            size++;
            checkAround(x, y+1);
        }        

    }

    checkAround(point[0], point[1]);

    return size;
}


const max3 = basins.sort((x, y) => Number(x) - Number(y)).slice(-3);

const res = max3.reduce((p, c) => p * c, 1);
 U.log(max3, res);
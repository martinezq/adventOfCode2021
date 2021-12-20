const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines.map(x => x)
    const pixels = R.head(data).split('');

    const image0 = R.tail(R.tail(data)).map(x => x.split(''));

    U.log('pixels', pixels);

    U.log('image');
    U.log(U.matrixToTile(image0));

    const image1 = addBorderToMatrix(image0, '.');

    U.log('image1');
    U.log(U.matrixToTile(image1));
    // U.logm(image1);

    let image = image1;

    for (let i=0; i<2; i++) {
        image = enhance(image, pixels);

        U.log('step', i);
        U.log(U.matrixToTile(image));
    }

    const countPixelsInRows = image.map(r => r.filter(p => p === '#').length);
    const countPixels = countPixelsInRows.reduce(R.add, 0);

    return countPixels;
}

function addBorderToMatrix(m, c) {
    c = c || '.';
    const width = m[0].length;

    const emptyLine = R.times(i => c, width + 10);

    return [ emptyLine, emptyLine, emptyLine, emptyLine, emptyLine ]
        .concat(m.map(r => [ c, c, c, c, c, r, c, c, c, c, c ].flat()))
        .concat([ emptyLine, emptyLine, emptyLine, emptyLine, emptyLine ]);
}

function enhance(m, pixels) {
    const width = m[0].length;
    const height = m.length;

    const result = [];

    // const emptyLine = R.times(x => '.', width + 10);

    // const result = [
    //     emptyLine, emptyLine, emptyLine, emptyLine, emptyLine
    // ];

    let defaultChar;

    for (let j=1; j<height-1; j++) {
        //let row = [ '.', '.', '.', '.', '.', '.' ];
        let row = [];
        for (let i=1; i<width-1; i++) {
            const part = [
                m[j-1].slice(i-1, i+2),
                m[j].slice(i-1, i+2),
                m[j+1].slice(i-1, i+2),
            ];

            // U.log(U.matrixToTile(part));

            const line = part.flat();
            const binary = line.map(x => x === '#' ? 1 : 0).join('');
            const index = parseInt(binary, 2);

            const pixel = pixels[index];
            row.push(pixel);

            if (!defaultChar) defaultChar = pixel;
            // U.log(binary, int, pixel);
        }
        // row.push('.', '.', '.', '.', '.', '.');
        result.push(row);
    }

    // result.push(
    //     emptyLine, emptyLine, emptyLine, emptyLine, emptyLine
    // );
    
    return addBorderToMatrix(result, defaultChar);
}
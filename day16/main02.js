const R = require('ramda');
const U = require('./utils');

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    const data = lines[0];
    const expectedLength = data.length * 4;

    const dataBinary = data.split('').map(x => ('0000' + parseInt(x, 16).toString(2)).slice(-4)).join('');

    U.log(data, dataBinary);

    const decoded = decodePackage(dataBinary);

    U.logf(decoded);

    return calculate(decoded);
}

function decodePackage(dataBinary) {
    const version = parseInt(dataBinary.substring(0, 3), 2);
    const id = parseInt(dataBinary.substring(3, 6), 2);

    let decoded;

    if (id === 4) {
        decoded = decodeLiteralPackage(version, id, dataBinary.substring(6));
    } else {
        decoded = decodeOperationPackage(version, id, dataBinary.substring(6));
    }

    return { ...decoded, length: decoded.length + 6 }

}

function decodeLiteralPackage(version, id, dataBinary) {
    const allParts = U.splitStringByLength(dataBinary, 5);
    const lastPartIndex = allParts.findIndex(x => x[0] === '0');

    const parts = allParts.slice(0, lastPartIndex + 1);
    const partsData = parts.map(p => p.slice(1)).join('');
    const value = parseInt(partsData, 2);

    const length = parts.length * 5;

    return { version, id, dataBinary, parts, partsData, value, length };
}

function decodeOperationPackage(version, id, dataBinary) {
    const packageSize = dataBinary[0] === '0' ? 15 : 11;
    const firstPacketIndex = packageSize + 1;

    if (dataBinary[0] === '0') {
        const packagePartLength = parseInt(dataBinary.substring(1, firstPacketIndex), 2);
        const packageDataBinary = dataBinary.substring(firstPacketIndex, firstPacketIndex + packagePartLength);

        let subPackages = [];
        let buf = packageDataBinary;
        let totalLength = 0;

        do {
            const subPackage = decodePackage(buf);
            const length = subPackage.length;
            totalLength += length;
            buf = buf.substring(length);
            subPackages.push(subPackage);
        } while(totalLength < packagePartLength)

        const length = packagePartLength + packageSize + 1;

        return { version, id, dataBinary, packagePartLength, packageDataBinary, subPackages, length };

    } else {
        const packageCount = parseInt(dataBinary.substring(1, firstPacketIndex), 2);

        let subPackages = [];
        let buf = dataBinary.substring(firstPacketIndex);
        let i = 0;
        let totalLength = 0;

        do {
            const subPackage = decodePackage(buf);
            const length = subPackage.length;
            buf = buf.substring(length);
            totalLength += length;
            subPackages.push(subPackage);
        } while(++i < packageCount)

        const length = totalLength + packageSize + 1;

        return { version, id, dataBinary, subPackages, length };
    }
}


function calculate(decoded) {
    switch(decoded.id) {
        case 4:
            return decoded.value;
        case 0:
            return decoded.subPackages.reduce((p, c) => p + calculate(c), 0);
        case 1:
            return decoded.subPackages.reduce((p, c) => p * calculate(c), 1);
        case 2:
            return decoded.subPackages.reduce((p, c) => Math.min(p, calculate(c)), Number.POSITIVE_INFINITY);
        case 3:
            return decoded.subPackages.reduce((p, c) => Math.max(p, calculate(c)), Number.NEGATIVE_INFINITY);
        case 5:
            return calculate(decoded.subPackages[0]) > calculate(decoded.subPackages[1]) ? 1 : 0;
        case 6:
            return calculate(decoded.subPackages[0]) < calculate(decoded.subPackages[1]) ? 1 : 0;
        case 7:
            return calculate(decoded.subPackages[0]) === calculate(decoded.subPackages[1]) ? 1 : 0
        }
    
    return 0;
}
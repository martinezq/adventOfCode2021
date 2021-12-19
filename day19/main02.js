const R = require('ramda');
const U = require('./utils');

const ROTATIONS = generateRotations();

U.runWrapper(run);

// --------------------------------------------

function run(lines) {
    let scanners = readData(lines);

    // U.log(scanners);

    scanners[0].offset = [0, 0, 0];

    let scannersDone = [ scanners[0] ];
    scanners = R.tail(scanners);

    while (scanners.length > 0) {
        for (let i=0; i<scanners.length; i++) {
            for (let j=0; j<scannersDone.length; j++) {
                const triedScanner = scanners[i];
                const oo = findOffsetAndOrientation(scannersDone[j], triedScanner);

                if (oo) {
                    scannersDone.push({
                        offset: oo.offset,
                        beacons: triedScanner.beacons.map(b => convertBeacon(b, oo.rotation, oo.offset))
                    });

                    scanners = scanners.slice(0, i).concat(scanners.slice(i+1));

                    i = Number.POSITIVE_INFINITY;
                    j = Number.POSITIVE_INFINITY;
                }
            }
        }
        U.log('left scanners', scanners.length);
    }

    const allBeacons = scannersDone.map(s => s.beacons).flat();

    let maxDistance = 0;

    for (let i=0; i<scannersDone.length; i++) {
        for (let j=0; j<scannersDone.length; j++) {
            if (i != j) {
                const o1 = scannersDone[i].offset;
                const o2 = scannersDone[j].offset;
                const diff = o1.map((x, i) => Math.abs(x - o2[i]));
                const dist = diff.reduce(R.add, 0);

                if (dist > maxDistance) maxDistance = dist;
            }
        }
    }

    return maxDistance;
}

function readData(lines) {
    const data = lines.join('\n');
    const data2 = data.split('\n\n');

    const data3 = data2.map(x => R.tail(x.split('\n')));
    const data4 = data3.map(x => ({
        beacons: x.map(y => JSON.parse(`[${y}]`))
    }));

    // U.log(data4);

    return data4;
}

function findOffsetAndOrientation(s1, s2) {
    const s2Variants = generateScannerVariants(s2);

    // U.log('variants', s2Variants);

    for (let i = 0; i < s1.beacons.length; i++) {
        for (let v = 0; v < s2Variants.length; v++) {
            const s2Variant = s2Variants[v];

            for (let j = 0; j < s2Variant.beacons.length; j++) {
                const b1 = s1.beacons[i];
                const b2 = s2Variant.beacons[j];

                const offset = b1.map((_, i) => b1[i] - b2[i]);
                // U.log('offset', offset);

                const commonBeacons = findCommonBeaconsForOffset(s1, s2Variant, offset);
                // U.log('common', commonBeacons);

                if (commonBeacons.length >= 12) {
                    return { offset, rotation: s2Variant.rotation };
                }

            }
        }
    }
}

// function findCommonBeacons(s1, s2) {
//     const s2Variants = generateScannerVariants(s2);

//     // U.log('variants', s2Variants);

//     for (let i = 0; i < s1.beacons.length; i++) {
//         for (let v = 0; v < s2Variants.length; v++) {
//             const s2Variant = s2Variants[v];

//             for (let j = 0; j < s2Variant.beacons.length; j++) {
//                 const b1 = s1.beacons[i];
//                 const b2 = s2Variant.beacons[j];

//                 const offset = b1.map((_, i) => b1[i] - b2[i]);
//                 // U.log('offset', offset);

//                 const commonBeacons = findCommonBeaconsForOffset(s1, s2Variant, offset);
//                 // U.log('common', commonBeacons);

//                 if (commonBeacons.length >= 12) {
//                     return commonBeacons;
//                 }

//             }
//         }
//     }
// }

function generateScannerVariants(s) {
    const result = ROTATIONS.map(r => {
        const beacons = s.beacons.map(b => convertBeacon(b, r));
        return { rotation: r, beacons };
    });

    return result;
}

function convertBeacon(b, r, o) {
    // if (o) {
    //     b = b.map((_, i) => b[i] + o[i]);

    const x = r.map(rp => b[Math.abs(rp) - 1] * Math.sign(rp));

    if (!o) return x;

    return x.map((_, i) => x[i] + o[i]);
}

function findCommonBeaconsForOffset(s1, s2, offset) {
    let result = [];

    for (let i = 0; i < s1.beacons.length; i++) {
        for (let j = 0; j < s2.beacons.length; j++) {
            const b1 = s1.beacons[i];
            const b2 = s2.beacons[j];

            const c = b1.map((_, i) => b1[i] - offset[i]);
            const eq = c.every((_, i) => c[i] === b2[i]);

            if (eq) {
                result.push(b1);
            }
        }
    }

    return result;
}

function generateRotations() {
    const p = [1, 2, 3];
    return [
        rotate(p, 0,   0, 0),
        rotate(p, 90,  0, 0),
        rotate(p, 180, 0, 0),
        rotate(p, 270, 0, 0),

        rotate(p, 0,   90, 0),
        rotate(p, 90,  90, 0),
        rotate(p, 180, 90, 0),
        rotate(p, 270, 90, 0),

        rotate(p, 0,   180, 0),
        rotate(p, 90,  180, 0),
        rotate(p, 180, 180, 0),
        rotate(p, 270, 180, 0),

        rotate(p, 0,   270, 0),
        rotate(p, 90,  270, 0),
        rotate(p, 180, 270, 0),
        rotate(p, 270, 270, 0),

        rotate(p, 0,   0, 90),
        rotate(p, 90,  0, 90),
        rotate(p, 180, 0, 90),
        rotate(p, 270, 0, 90),

        rotate(p, 0,   0, 270),
        rotate(p, 90,  0, 270),
        rotate(p, 180, 0, 270),
        rotate(p, 270, 0, 270),        
    ];
}

function rotate(p, roll, yaw, pitch) {
    const rot = generateRotation(yaw, pitch, roll).map(x => x.map(Math.round));
    // U.log(rot);

    return rot.map((r, i) => {
        let result = 0;
        for (let j = 0; j < p.length; j++) {
            result += r[j] * p[j];
        }
        return result;
    });
}

function generateRotation(a, b, g) {
    // https://en.wikipedia.org/wiki/Rotation_matrix

    const cos = Math.cos;
    const sin = Math.sin;

    a = degToRad(a);
    b = degToRad(b);
    g = degToRad(g);

    return [
        [cos(a) * cos(b), cos(a) * sin(b) * sin(g) - sin(a) * cos(g), cos(a) * sin(b) * cos(g) + sin(a) * sin(g)],
        [sin(a) * cos(b), sin(a) * sin(b) * sin(g) + cos(a) * cos(g), sin(a) * sin(b) * cos(g) - cos(a) * sin(g)],
        [-sin(b), cos(b) * sin(g), cos(b) * cos(g)]
    ];
}

function degToRad(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
}
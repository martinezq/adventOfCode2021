function parse(str, regex, keys) {
    const a = str
        .match(regex)
        .slice(1)
        .map(x => Number(x) || x)

    if (keys) {
        let result = {};
        keys.forEach((k, i) => result[k] = a[i]);
        return result
    }

    return a;
}

function log(...x) {
    console.log(...x.map(JSON.stringify));
}

function logf(...x) {
    console.log(...x.map(y => JSON.stringify(y, null, 2)));
}

const minA = (x) => x.reduce((p, c) => Math.min(p, c), Number.POSITIVE_INFINITY);
const maxA = (x) => x.reduce((p, c) => Math.max(p, c), Number.NEGATIVE_INFINITY);

module.exports = {
    parse,
    log, logf,
    minA, maxA
}
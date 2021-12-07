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
    console.log(JSON.stringify(x));
}

function logf(...x) {
    console.log(JSON.stringify(x, null, 2));
}

module.exports = {
    parse,
    log, logf
}
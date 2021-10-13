function stringifyBigInts(o) {
    if ((typeof(o) == "bigint") || (o instanceof bigInt))  {
        return o.toString(10);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        for (let k in o) {
            res[k] = stringifyBigInts(o[k]);
        }
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return bigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object" && !(o instanceof bigInt)) {
        const res = {};
        for (let k in o) {
            res[k] = unstringifyBigInts(o[k]);
        }
        return res;
    } else {
        return o;
    }
}

function hexifyBigInts(o) {
    if (typeof (o) === "bigInt" || (o instanceof bigInt)) {
        let str = o.toString(16);
        while (str.length < 64) str = "0" + str;
        str = "0x" + str;
        return str;
    } else if (Array.isArray(o)) {
        return o.map(hexifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        for (let k in o) {
            res[k] = hexifyBigInts(o[k]);
        }
        return res;
    } else {
        return o;
    }
}

function unhexifyBigInts(o) {
    if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o)))  {
        return bigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unhexifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        for (let k in o) {
            res[k] = unhexifyBigInts(o[k]);
        }
        return res;
    } else {
        return o;
    }
}

window.stringifyBigInts = stringifyBigInts;
window.unstringifyBigInts = unstringifyBigInts;
window.hexifyBigInts = hexifyBigInts;
window.unhexifyBigInts = unhexifyBigInts;
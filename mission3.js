const fs = require('fs');

const isDescending = (arr, start) => {
    let val = arr[start];
    for (var i = start; i < arr.length; i++) {
       if (arr[i] > val) return false;
       val = arr[i];
    }
    return true;
}

const reelRight = (measures, start) => {
    if (isDescending(measures, start)) return Number.POSITIVE_INFINITY;

    let i = start;
    while (measures[i] >= measures[measures.length-1]) {
        if (Math.max(...measures.slice(i)) > measures[i]) break;
        i++;
    }

    return i;
}

const leftEdge = (measures, start) => {
    let val = measures[start];

    for (var i = start+1; i < measures.length; i++) {
        if (val > measures[i]) {
            return i-1;
        }
        if (val < measures[i]) val = measures[i];
    }
    return Number.NEGATIVE_INFINITY;
}

const rightEdge = (measures, start) => {
    let valLimit = Math.min(measures[start], Math.max(...measures.slice(start+1)));

    for (var i = start+1; i < measures.length; i++) {
        if (measures[i] >= valLimit) return i;
    }

    return Number.POSITIVE_INFINITY;
}

const calculateVolume = (measures, pools) => {
    let volume = 0;
    pools.forEach(c => {
        let base = Math.min(measures[c.left], measures[c.right]);

        for (var i = c.left+1; i < c.right; i++) {
            volume += (base - measures[i]);
        }
    });

    return volume;
}

const identifyPools = (measures) => {
    let pools = [];
    let i = 0;
    while (i < measures.length) {
        let lEdge = leftEdge(measures, i);
        if (lEdge == Number.NEGATIVE_INFINITY) break;

        let rEdge = rightEdge(measures, lEdge);
        if (rEdge == Number.POSITIVE_INFINITY) break;

        pools.push({ left: lEdge, right: rEdge });
        i = reelRight(measures, rEdge)-1;

        if (isDescending(measures, i)) break;
    }

    return pools;
}

let data = JSON.parse(fs.readFileSync("m3.json"));

let password = "";
data.regions.forEach(c => {
    let last = null;
    c.readings.forEach(d => {
        let current = calculateVolume(d.reading, identifyPools(d.reading));
        if (last != null && Math.abs(last-current) > 1000) password += d.readingID;
        last = current;
    })
})

console.log(`Password: ${password}`);
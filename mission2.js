const fs = require('fs');

const average = (data) => data.reduce((sum, value) => sum+value)/data.length;
const stDev = (data) => Math.sqrt(average(data.map(c => (c - average(data))**2)));

let data = JSON.parse(
    fs.readFileSync("m2.bin.log").toString()
        .split(" ")
        .map(c => String.fromCharCode(parseInt(c, 2)))
        .join(""));

let readings = new Map(data.flatMap(c => 
    c.readings.map(d => [
        d.id, 
        Object.values(d.contaminants).reduce((a,b) => a + b, 0)
    ])
));

let avg = average(Array.from(readings.values()));
let dev = stDev(Array.from(readings.values()));

readings.forEach((v, k) => {
    if (v > avg + dev || v < avg - dev) console.log(`Password: ${Buffer.from(k, "hex").toString("ascii")}`);
})

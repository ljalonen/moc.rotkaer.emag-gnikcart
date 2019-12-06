const fs = require('fs') 

let data = fs.readFileSync("m1.b64").toString()
    .split("").reverse().join("") // very hax

for (var i = 0; i < data.length; i++) {
    let sub = data.substr(i, 16)
    if (sub.length < 16) break;
    if (String.prototype.concat(...new Set(sub)).length == 16) {
        console.log(`Password: ${Buffer.from(sub, "base64").toString("ascii")}`)
    }
}


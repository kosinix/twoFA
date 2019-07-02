//// Core modules
const fs = require('fs');
const path = require('path');
const util = require('util');

//// External modules
const lodash = require('lodash');

//// Modules


// Load the right config based on environment
const env = lodash.get(process, 'env.NODE_ENV', 'dev');
let filePath = path.join(APP_DIR, 'credentials.json');
if (env === "sandbox") {
    filePath = path.join(APP_DIR, 'credentials-live.json');
} else if (env === "live") {
    filePath = path.join(APP_DIR, 'credentials-live.json');
}
console.log(util.format('Load credentials %s', filePath));

// Read config from file
let cred = fs.readFileSync(filePath, { encoding: 'utf8' });

//// Export
module.exports = JSON.parse(cred);
//// Core modules
const fs = require('fs');
const path = require('path');
const util = require('util');

//// External modules
const lodash = require('lodash');

//// Modules


// Load the right config based on environment
const env = lodash.get(process, 'env.NODE_ENV', 'dev');
let filePath = path.join(APP_DIR, 'config.json');
if (env === "sandbox") {
    filePath = path.join(APP_DIR, 'config-sandbox.json');
} else if (env === "live") {
    filePath = path.join(APP_DIR, 'config-live.json');
}
console.log(util.format('Load config %s', filePath));

// Read config from file
let config = fs.readFileSync(filePath, { encoding: 'utf8' });

// Replace all instances of $APP_DIR with actual file path of this apps root directory
config = config.replace(/\$APP_DIR/g, APP_DIR);
config = JSON.parse(config);

//// Export
module.exports = config;
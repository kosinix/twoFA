// Entry point of node.js app

//// Core modules
const util = require('util');
const path = require('path');

//// First things first
//// Save full path of our root app directory and load config and credentials for convenience
global.APP_DIR = path.resolve(__dirname).replace(/\\/g, '/'); // Turn back slash to slash for cross-platform compat
global.CONFIG = require(path.join(APP_DIR, 'src', 'config'));
global.CRED = require(path.join(APP_DIR, 'src', 'cred'));

/**
 * Similar to require but resolves to full path
 * Usage:
 * include src/texter.js => include('src/texter')
 * include data/model/token.js => include('data/model/token')
 */
global.include = (moduleName) => {
    return require(path.join(CONFIG.app.dir, moduleName));
}

//// Create our app
let server = include('data/src/express');
server.listen(CONFIG.app.port, function () {
    console.log(util.format('App running at %s', CONFIG.app.url));
});
server.keepAliveTimeout = 60000 * 2;



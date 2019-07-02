//// Core modules
const path = require('path');
const util = require('util');

//// External modules
const moment = require('moment');

//// Modules
const weaverLogger = include('src/weaverLogger');


let loggerError = new weaverLogger.Logger({
    transports: [
        new weaverLogger.transports.Console(),
        new weaverLogger.transports.DailyFile({
            directory: path.join(CONFIG.app.dirs.data, 'log'),
            formatter: (message) => {
                let today = moment();//new Date();
                return util.format('%s: %s %s', today.utcOffset('+0800').format('YYYY-MM-DD hh:MM:ss A ([UTC]Z)'), message, "\n");
            }
        })
    ],
});

let loggerOk = new weaverLogger.Logger({
    transports: [
        new weaverLogger.transports.Console()
    ]
});

//// Wrap logger in to nicer API
module.exports = {
    log: (message) => {
        loggerOk.log(message);
    },
    error: (message) => {
        loggerError.log(message);
    }
};
// A simple logging utility that uses built-in modules Date and Stream

//// Core modules
const fs = require('fs');
const util = require('util');
const path = require('path');

//// External modules

//// Modules


/*
Usage:
    // Import
    const weaverLogger = require('/path/to/weaverLogger');

    // Initialize
    const logger = new weaverLogger.Logger({
        transports: [
            new weaverLogger.transports.Console(),
            new weaverLogger.transports.File('/logs/uploads.log')
        ]
    });

    // Log
    logger.log('Start of upload');
*/
class Logger {
    constructor(opts) {
        let defaults = {
            transports: [new TransportConsole()]
        };
        opts = Object.assign(defaults, opts);
        this.transports = opts.transports;
    }
    log(message, ...params) {
        message = util.format(message, ...params);
        for (let i = 0; i < this.transports.length; i++) {
            this.transports[i].log(message);
        }
    }
}

class TransportConsole {
    constructor(opts) {
        let defaults = {
            formatter: (message) => {
                return message;
            }
        };
        opts = Object.assign(defaults, opts);
        this.formatter = opts.formatter;
    }
    log(message) {
        console.log(this.formatter(message));
    }
}

class TransportFile {
    constructor(fileName, opts) {
        let defaults = {
            formatter: (message) => {
                let today = new Date();
                return util.format('%s: %s %s', today.toISOString(), message, "\n");
            }
        };
        opts = Object.assign(defaults, opts);
        this.fileName = fileName;
        this.formatter = opts.formatter;
    }
    log(message) {
        let writeStream = fs.createWriteStream(this.fileName, { flags: 'a' });
        writeStream.write(this.formatter(message));
    }
}

class TransportDailyFile {
    constructor(opts) {
        let defaults = {
            directory: '',
            formatter: (message) => {
                let today = new Date();
                return util.format('%s: %s %s', today.toISOString(), message, "\n");
            }
        };
        opts = Object.assign(defaults, opts);
        this.fileName = path.join(opts.directory, new Date().toISOString().slice(0, 10) + '.txt');
        this.formatter = opts.formatter;
    }
    log(message) {
        let writeStream = fs.createWriteStream(this.fileName, { flags: 'a' });
        writeStream.write(this.formatter(message));
    }
}

// Export
module.exports = {
    Logger: Logger,
    transports: {
        Console: TransportConsole,
        File: TransportFile,
        DailyFile: TransportDailyFile
    }
};

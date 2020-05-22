//// Core modules

//// External modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const lodash = require('lodash');

//// Modules
const db = require('./db');
const errors = require('../../src/errors');
const logger = require('./logger');
const middlewares = require('./middlewares');
const nunjucksEnv = require('./nunjucks-env');
const routes = require('./routes');
const session = require('./session');


//// Create app
const app = express();

//// Setup view
nunjucksEnv.express(app);

//// Global variables
// Assign once on node run
app.locals = CONFIG

// Remove express
app.set('x-powered-by', false);

//// Middlewares
// Session middleware
app.use(session);

// Static public files
let setHeaders = (res, path, stat) => {
    res.setHeader('X-Powered-By', 'static'); // Add this to static files
}
app.use(express.static(CONFIG.app.dirs.public, { setHeaders: setHeaders }));

// Parse http body
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Cookies
app.use(cookieParser());


//// Set express vars
// Indicates the app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client.
app.set('trust proxy', CONFIG.express.trustProxy);

// Assign per request
app.use((req, res, next)=>{
    try {
        res.locals.user = lodash.get(req, 'session.user')
        next()
    } catch (err) {
        next(err)
    }
});

app.use(middlewares.addRouteId);


//// Routes
app.use(routes);

// Error handler
app.use(function (error, req, res, next) {
    try {
        if (res.headersSent) {
            return next(err);
        }
        req.socket.on("error", function (err) {
            logger.error(err);
        });
        res.socket.on("error", function (err) {
            logger.error(err);
        });


        error = errors.normalizeError(error);
        logger.error(req.originalUrl)
        logger.error(error)
        if (req.xhr) { // response when req was ajax
            return res.status(400).send(error.message)
        }
        if (/^\/api\//.test(req.originalUrl)) {
            return res.status(500).send('API error...');
        }

        // Anything that is not caught
        res.status(500).send('Something broke...');
    } catch (err) {
        // If an error handler had an error!! 
        error = errors.normalizeError(err);
        logger.error(req.originalUrl)
        logger.error(error)
        res.status(500).send('Unexpected error!');
    }
});

//// Export
module.exports = app;
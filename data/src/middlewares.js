//// Core modules

//// External modules
const express = require('express');
const flash = require('kisapmata');
const lodash = require('lodash');
const speakeasy = require('speakeasy')
const QRCode = require('qrcode');

//// Modules
const auther = require('./auther');
const db = require('./db');

module.exports = {
    addRouteId: async (req, res, next) => {
        try {
            let routeId = lodash.camelCase(`${req.originalUrl}`.replace(/\//gi, ' '))
            res.routeId = (routeId)
            next()
        } catch (err) {
            next(err);
        }
    },
    antiCsrfCheck: async (req, res, next) => {
        try {
            let post = req.body
    
            if (lodash.get(req, 'session.acsrf') === post.acsrf) {
                return next();
            }
            res.status(400).send('Cross-site request forgery error')
        } catch (err) {
            next(err);
        }
    },
    requireAuthUser: async (req, res, next) => {
        try {
            let user = lodash.get(req, 'session.user')
            let auth2fa = lodash.get(req, 'session.auth2fa')
    
            if (!user) {
                return res.redirect('/login')
            }
            res.user = user

            next()
        } catch (err) {
            next(err);
        }
    },
    requireConfirmedPass: async (req, res, next) => {
        try {
            let confirmedPass = lodash.get(req, 'session.confirmedPass')
    
            if (!confirmedPass) {
                return res.redirect('/confirm-password')
            }

            res.confirmedPass = confirmedPass
            next()
        } catch (err) {
            next(err);
        }
    },
}
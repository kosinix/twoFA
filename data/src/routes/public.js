//// Core modules

//// External modules
const express = require('express');
const flash = require('kisapmata');
const lodash = require('lodash');
const speakeasy = require('speakeasy')
const QRCode = require('qrcode');

//// Modules
const auther = require('../auther');
const db = require('../db');
const middlewares = require('../middlewares');

// Router
let router = express.Router();

router.get('/login', async (req, res, next) => {
    try {
        res.render('login.html',{
            flash: {
                error: flash.get(req, 'login.error')
            }
        });
    } catch (err) {
        next(err);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        // search for attributes
        let user = await db.User.findOne({ where: {username: req.body.username} })
  
        if(!user){
            flash.set(req, 'login.error', 'User not found.')
            return res.redirect('/login')
        }

        if(user.passwordHash !== auther.passwordHash(req.body.password, user.salt)){
            flash.set(req, 'login.error', 'Incorrect password.')
            return res.redirect('/login')
        }
        req.session.user = user.toJSON()

        if(user.OTPSecret){
            return res.redirect('/login-otp')
        }

        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/logout', async (req, res, next) => {
    try {
        lodash.set(req.session, 'user', null);
        lodash.set(req.session, 'confirmedPass', null);
        lodash.set(req.session, 'otpSecret', null);
        lodash.set(req.session, 'otpSecretAscii', null);
        res.clearCookie(CONFIG.session.name, CONFIG.session.cookie);
        res.redirect('/login')
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        res.render('index.html');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
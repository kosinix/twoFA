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

router.get('/login-otp', middlewares.requireAuthUser, async (req, res, next) => {
    try {
        console.log(res.routeId)

        res.render('login-otp.html',{
            flash: {
                error: flash.get(req, `${res.routeId}.error`)
            }
        });
    } catch (err) {
        next(err);
    }
});
router.post('/login-otp', middlewares.requireAuthUser, async (req, res, next) => {
    try {
        var verified = speakeasy.totp.verify({
            secret: res.user.OTPSecret,
            encoding: 'base32',
            token: req.body.otp
        })

        if(!verified){
            flash.set(req, `${res.routeId}.error`, 'Incorrect OTP.')
            return res.redirect('/login-otp')
        }
       
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/confirm-password', middlewares.requireAuthUser, async (req, res, next) => {
    try {
        res.render('two-fa/confirm-password.html', {
            flash: {
                error: flash.get(req, 'confirm-password.error')
            }
        });
    } catch (err) {
        next(err);
    }
});
router.post('/confirm-password', middlewares.requireAuthUser, async (req, res, next) => {
    try {
        let user = res.user

        if (user.passwordHash !== auther.passwordHash(req.body.password, user.salt)) {
            flash.set(req, 'confirm-password.error', 'Incorrect password.')
            return res.redirect('/confirm-password')
        }
        req.session.confirmedPass = true
        res.redirect('/recovery-codes');
    } catch (err) {
        next(err);
    }
});

router.get('/recovery-codes', middlewares.requireAuthUser, middlewares.requireConfirmedPass, async (req, res, next) => {
    try {
        res.render('two-fa/recovery-codes.html', {
            flash: {
                error: flash.get(req, 'recovery-codes.error')
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/save-code', middlewares.requireAuthUser, middlewares.requireConfirmedPass, async (req, res, next) => {
    try {
        let secretLength = CONFIG.twoFA.secretLength
        let label = CONFIG.twoFA.label
        let issuer = CONFIG.twoFA.issuer

        // See if we've been here, use existing
        let otpSecret = lodash.get(req, 'session.otpSecret')
        if (!otpSecret) {
            let secret = speakeasy.generateSecret({
                length: secretLength
            });
            otpSecret = secret.base32
            req.session.otpSecret = otpSecret
        }

        // console.log(otpSecret)
        let url = speakeasy.otpauthURL({
            secret: otpSecret,
            label: label,
            issuer: issuer,
            encoding: 'base32'
        })
        // console.log(url)

        // var otp = speakeasy.totp({
        //     secret: otpSecret,
        //     encoding: 'base32'
        // });
        // console.log('otp', otp)

        // var verified = speakeasy.totp.verify({
        //     secret: otpSecret,
        //     encoding: 'base32',
        //     token: otp
        // })

        // console.log('verified', verified)

        let qrCode = await QRCode.toDataURL(url)
        res.render('two-fa/save-code.html', {
            url: url,
            qrCode: qrCode,
            flash: {
                error: flash.get(req, 'twofa.error')
            }
        });

    } catch (err) {
        next(err);
    }
});

router.post('/save-code', middlewares.requireAuthUser, middlewares.requireConfirmedPass, async (req, res, next) => {
    try {

        let secret = req.session.otpSecret

        var verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: req.body.otp
        });

        if (!verified) {
            flash.set(req, 'twofa.error', 'OTP incorrect.')
            return res.redirect('/save-code')
        }

        console.log('verified', secret)
        let user = await db.User.findOne({ where: { id: res.user.id } })
        if (user) {
            await user.update({
                OTPSecret: secret
            })
        }

        return res.redirect('/done')
    } catch (err) {
        next(err);
    }
});

router.get('/done', middlewares.requireAuthUser, middlewares.requireConfirmedPass, async (req, res, next) => {
    try {
        return res.render('two-fa/done.html')
    } catch (err) {
        next(err);
    }
})

router.get('/get-otp', middlewares.requireAuthUser, async (req, res, next) => {
    try {

        let secret = res.user.OTPSecret
        console.log(res.user)
        var token = speakeasy.totp({
            secret: secret,
            encoding: 'ascii'
        });

        return res.send(token)
    } catch (err) {
        next(err);
    }
});
router.get('/test-otp', middlewares.requireAuthUser, async (req, res, next) => {
    try {

        let secret = res.user.OTPSecret

        var verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'ascii',
            token: req.params.otp
        });

        return res.send(verified)
    } catch (err) {
        next(err);
    }
});

module.exports = router;
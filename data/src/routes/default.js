//// Core modules

//// External modules
const express = require('express');
const speakeasy = require('speakeasy')
const QRCode = require('qrcode');

//// Modules

// Router
let router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let secret = speakeasy.generateSecret({length: 20});
        req.session.secretBase32 = secret.base32
        let url = speakeasy.otpauthURL({ secret: secret.ascii, label:'juan@example.com', issuer: 'EasycashDash' })
        QRCode.toDataURL(url, function (err, dataUrl) {
            
            if(err){
                return next(err)
            }

            res.render('index.html', {
                qrCode: dataUrl
            });
            
        });

        
    } catch (err) {
        next(err);
    }
});
router.get('/test', async (req, res, next) => {
    try {

        let base32secret = req.session.secretBase32

        var verified = speakeasy.totp.verify({ secret: base32secret,
            encoding: 'base32',
            token: req.query.token });

        return res.send(verified)
    } catch (err) {
        next(err);
    }
});
router.get('/token', async (req, res, next) => {
    try {

        let base32secret = req.session.secretBase32

        var token = speakeasy.totp({
            secret: base32secret,
            encoding: 'base32'
        });

        return res.send(token)
    } catch (err) {
        next(err);
    }
});

module.exports = router;
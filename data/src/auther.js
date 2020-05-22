//// Core modules
const crypto = require('crypto');

//// External modules

//// Modules

const passwordHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

module.exports = {
    passwordHash: passwordHash,
};
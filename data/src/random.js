//// Core modules
const crypto = require('crypto');

//// External modules

//// Modules

const numbers = (length = 10, chars = '0123456789') => {
    let bytes = crypto.randomBytes(length);

    let values = [];
    let d = 256 / length;
    for(let x = 0; x < length; x++ ){
        let index = Math.floor(bytes[x] / d)
        values.push(chars[index])
    }

    return values.join('')
}

const hex = (length) => {
    return crypto.randomBytes(length).toString('hex');
}

module.exports = {
    numbers: numbers,
    hex: hex
};
//// Core modules

//// External modules
let lodash = require('lodash');


let flash = {
    set: (req, id, message) => {
        lodash.set(req, 'session.flash.' + id, message);
    },
    get: (req, id) => {
        let r = lodash.get(req, 'session.flash.' + id, '');
        lodash.set(req, 'session.flash.' + id, '');
        return r;
    }
}
// Export
module.exports = flash;


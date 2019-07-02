let lodash = require('lodash');
let crypto = require('crypto');

/**
 * Look for fields in <fields> that are in the <allowed> list, then convert each field value to string, and trim whitespaces.
 * 
 * @param {Object} fields Object of fields, example from req.body.
 * @param {Array} allowed Array of names of allowed fields.
 * @param {Boolean} assignMissing True to create fields that are absent in <fields> but present in <allowed>. Assign an empty string as defaults.
 * 
 * @return {Object} Object of fields that are in the <allowed> list.
 */
let allowedFields = (fields, allowed, assignMissing = false) => {
    let post = {}
    lodash.each(allowed, (allowedKey) => {
        let found = lodash.find(fields, (_, fieldKey) => {
            return allowedKey === fieldKey
        })
        if (found !== undefined) { // Strict type test. If field is in allowed list, include it
            let cleanValue = '';
            // console.log(typeof found);
            if (typeof found === "undefined") {
                // Defaults to ''
            } else if (typeof found === "boolean") {
                cleanValue = found; // As is
            } else if (typeof found === "number") {
                cleanValue = found // As is
            } else if (typeof found === "string") {
                cleanValue = lodash.trim(found); // Trim
            } else if (typeof found === "symbol") { // Symbol (new in ECMAScript 2015)
                // Defaults to ''
            } else if (typeof found === "function") {
                // Defaults to ''
            } else if (typeof found === "object") {
                cleanValue = JSON.stringify(found)
            } else {
                // Unknown types defaults to ''
            }

            post[allowedKey] = cleanValue;
        } else {
            if (assignMissing) { // If true, then add this field with value of empty string (use case: prevents null error)
                post[allowedKey] = ""
            }
        }
    });

    return post
}

let hashPassword = (password, salt = "HbH*+nT!U65Dkxef") => {
    return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
};

let cleanMobileNo = (mobileNo, countryCode = "63") => {
    mobileNo = lodash.toString(mobileNo);
    if (mobileNo.length > 10) {
        mobileNo = countryCode + mobileNo.substr(-10); // Trim to 10 chars and prepend countryCode: (eg. "63")
    } else if (mobileNo.length === 10) {
        mobileNo = countryCode + mobileNo;
    }
    return mobileNo;
}

// Export
module.exports = {
    allowedFields: allowedFields,
    hashPassword: hashPassword,
    cleanMobileNo: cleanMobileNo
};


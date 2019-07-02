//// Core modules

//// External modules
const lodash = require('lodash');

//// Modules

/*

Error type module

Usage:
    
*/

// Change values that are not instanceof Error into Error
let normalizeError = function (error) {

    switch (typeof error) { // With switch case, we can use the stack trace and find out what the original error type is
        case "undefined":
            return new Error(error);

        case "boolean":
            return new Error(error);

        case "number":
            return new Error(error);

        case "string":
            return new Error(error);

        case "symbol":
            return new Error(error);

        case "function":
            return new Error(error);

        case "object": // typeof null === 'object' and everything else
            if (error instanceof Error) {
                if (error.response) { // This is axios
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    let returnStatus = lodash.get(error, 'response.data.returnStatus')
                    if (returnStatus) {
                        return new Error(returnStatus);
                    }
                    return error;
                } else if (error.request) { // This is axios
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    return error;
                } else { // Regular error
                    return error;
                }
            }

            return new Error(error);

        default:
            return new Error(error);
    }

};


// Export
module.exports = {
    normalizeError: normalizeError
};


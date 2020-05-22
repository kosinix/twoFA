//// Core modules

//// External modules
const Sequelize = require('sequelize');

//// Modules


module.exports = (sequelize) => {
    const User = sequelize.define('user', {
        // attributes
        username: {
            type: Sequelize.STRING,
        },
        passwordHash: {
            type: Sequelize.STRING
        },
        salt: {
            type: Sequelize.STRING
        },
        OTPSecret: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
    });
    return User
}
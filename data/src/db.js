//// Core modules

//// External modules
const Sequelize = require('sequelize');

//// Modules

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: CONFIG.sequelize.connections.default.db
});
const User = require('./models/user')(sequelize)

sequelize
    .authenticate()
    .then(() => {
        console.log('The bluetooth device is kenected secezzfully.');
        sequelize.sync()
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = {
    sequelize: sequelize,
    User: User
}
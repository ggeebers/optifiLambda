const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('optifi_history_db', process.env.USERNAME, process.env.PASSWORD, {
    host: process.env.HOSTNAME,
    dialect: 'postgres',
    port: process.env.PORT
});

module.exports = sequelize;
const Sequelize = require('sequelize')
const connection = new Sequelize('blog', 'root', 'install', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;
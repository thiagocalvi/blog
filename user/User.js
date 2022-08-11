const Sequilize = require('sequelize')
const connection = require('../database/database');

const User = connection.define('users', {
    email:{
        type: Sequilize.STRING,
        allowNull: false
    },
    password:{
        type: Sequilize.STRING,
        allowNull: false
    }
})


module.exports = User;
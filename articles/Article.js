const Sequilize = require('sequelize')
const connection = require('../database/database');
const Category = require('../categories/Category')

const Article = connection.define('articles', {
    title:{
        type: Sequilize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequilize.STRING,
        allowNull: false
    },
    body:{
        type: Sequilize.TEXT,
        allowNull: false
    }
});

Article.belongsTo(Category); // relacionamento 1 para 1
Category.hasMany(Article) // relacionamento 1 para muitos


module.exports = Article;
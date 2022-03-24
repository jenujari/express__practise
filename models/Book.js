const { sequlizeConn, Sequelize } = require("./../sequelize");

const Book = sequlizeConn.define('book',{
  title:Sequelize.STRING,
  author:Sequelize.STRING,
  category:Sequelize.STRING,
});

module.exports = Book;

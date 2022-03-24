const { sequlizeConn, Sequelize } = require("./../sequelize");

const User = sequlizeConn.define('user',{
  username:Sequelize.STRING,
  password:Sequelize.STRING,
  email:Sequelize.STRING,
});

module.exports = User;

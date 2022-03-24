require("dotenv").config();

const Sequelize  = require("sequelize");

const DB_PATH = "DevDB.db";
const ENV = process.env.APP_ENV || "prod";

var sequlizeConn = null;

if(ENV === "test") {
  sequlizeConn = new Sequelize('sqlite::memory:');
} else {
  sequlizeConn = new Sequelize(`sqlite:${DB_PATH}`);
}

const ConnectionTest = async () => {
  try {
    await sequlizeConn.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  sequlizeConn,
  Sequelize,
  ConnectionTest
};

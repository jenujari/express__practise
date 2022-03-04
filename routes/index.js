const rtr = require("express").Router();

const bookRtr = require("./book");

rtr.use("/book",bookRtr);

module.exports = rtr;
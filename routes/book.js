const rtr = require("express").Router();

const router = rtr.get("/",(_ ,res) => {
  res.send({"key":"hello world"});
});

module.exports = router;

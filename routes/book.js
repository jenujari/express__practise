const rtr = require("express").Router();
const { User, Book } = require("./../models");
const { encryptPassword, comparePassword } = require("./../utils/helpers");

const router = rtr.get("/", async (_, res) => {
  const pwd = "Abcdefg@drftgy";
  const encPwd = await encryptPassword(pwd);
  const _usr = await User.create({
    username : "JenuJari",
    email    : "mail@mail.com",
    password : encPwd,
  });

  const pwdMatch = await comparePassword(pwd, _usr.password);

  res.send({
    message: `User Created and password matched : ${pwdMatch}`,
    _usr,
  });

  // Book.create({
  // title: "My Book",
  // author: "James",
  // category: "Cate Name",
  // })
  // .then((_bk_) => {
  // res.send({ success: `Book created with id : ${_bk_.id}` });
  // })
  // .catch((er) => {
  // res.send(er);
  // });
});

module.exports = router;

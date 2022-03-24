const bcrypt = require("bcrypt");

const encryptPassword = password => {
    return new Promise((res, rej) => {
        bcrypt.genSalt(10, (e, salt) => {
            if (e) {
                rej(e);
                return;
            }
            
            bcrypt.hash(password, salt, (er, hash) => {
                if (er) {
                    rej(er);
                    return;
                }
                res(hash);
            });
        });
    });
};

const comparePassword = (plainPass, hashword) => {
    return new Promise((res, rej) => {
        bcrypt.compare(plainPass, hashword, (err, isPasswordMatch) => {
            if (err) {
                rej(err);
                return;
            }
            res(isPasswordMatch);
        });
    });
};

module.exports = {
  encryptPassword,
  comparePassword 
};

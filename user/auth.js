const jwt = require('jsonwebtoken');
// require("cookie-parser");

const requireAuthUSER = (req, res, next) => {
    // let token = req.cookies.USER;
    // console.log(req.cookies);
    let token = req.signedCookies.USER;
    // console.log(req.signedCookies);
    console.log("USER Token = "+token);
    // check json web token exists & is verified
    if (token != null) {
        next();
    } else {
        res.redirect('/');
    }
};

const requireAuthADMIN = (req, res, next) => {
    let token = req.signedCookies.ADMIN;
    console.log("ADMIN Token = "+token);
    if (token != null) {
        next();
    } else {
        res.redirect('/');
    }
};

const deleteAuth = (req, res, next) => {
    res.clearCookie("ADMIN");
    res.clearCookie("USER");
    next();
};
module.exports = { requireAuthUSER, requireAuthADMIN, deleteAuth };
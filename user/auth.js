const jwt = require('jsonwebtoken');
// require("cookie-parser");

const requireAuth = (req, res, next) => {
    // let token = req.cookies.jwt;
    let token = req.signedCookies.jwt;
    // console.log(req.cookies);
    // console.log(req.signedCookies);
    console.log("token = "+token);
    // check json web token exists & is verified
    next();
    if (token != null) {
        next();
        // jwt.verify(token, 'net', (err, decodedToken) => {
        // if (err) {
        //     console.log(err);
        //     // console.log(err.message);
        //     res.redirect('/');
        // } else {
        //     console.log('decodedToken : '+decodedToken);
        //     next();
        // }
        // });
    } else {
        res.redirect('/');
    }
};
module.exports = { requireAuth };
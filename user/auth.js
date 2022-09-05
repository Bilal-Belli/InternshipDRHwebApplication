const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'net', (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            res.render('index');
        } else {
            console.log(decodedToken);
            next();
        }
        });
    } else {
        res.render('index');
    }
};

module.exports = { requireAuth };
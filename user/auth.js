const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'net', (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            res.redirect('index.html');
        } else {
            console.log(decodedToken);
            next();
        }
        });
    } else {
        res.redirect('index.html');
    }
};

module.exports = { requireAuth };

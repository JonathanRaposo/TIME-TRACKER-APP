const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.cookies?.authToken;
    if (!token) {
        return res.status(401).redirect('/login');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.log('error decoding token:', err);
            res.status(401).redirect('/login');
            return;
        }

        req.payload = decoded;
        next();
    })

}

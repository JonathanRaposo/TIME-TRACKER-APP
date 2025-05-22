
module.exports = function () {
    return function (req, res, next) {

        if (!req.headers.cookie) {
            return next()
        }

        req.cookies = {};
        const rawCookies = req.headers.cookie.split('; ')
        for (let pair of rawCookies) {
            const [key, value] = pair.split('=');
            req.cookies[key] = decodeURIComponent(value);
        }
        next();
    }
}

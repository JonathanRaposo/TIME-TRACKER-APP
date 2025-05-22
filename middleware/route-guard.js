
function isLoggedIn(req, res, next) {
    if (!req.cookies?.authToken) {
        return res.redirect('/login');
    }
    next()
}

function isLoggedOut(req, res, next) {
    if (req.cookies?.authToken) {
        return res.redirect('/')
    }
    next()
}

module.exports = {
    isLoggedIn,
    isLoggedOut
}
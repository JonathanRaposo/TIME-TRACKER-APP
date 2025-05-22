
module.exports = function (req, res, next) {

    if (req.payload.role !== 'admin') {
        return res.redirect('/');
    }
    next();
}
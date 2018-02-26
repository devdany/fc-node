module.exports = function(req, res, next) {
    if(!req.isAuthenticated()){
        res.redirect('/account/login');
    } else {
        return next();
    }
}
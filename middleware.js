module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {  // Check if user is NOT logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next(); // Proceed if user is logged in
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl= req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};
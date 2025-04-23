module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {  // Check if user is NOT logged in
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next(); // Proceed if user is logged in
};
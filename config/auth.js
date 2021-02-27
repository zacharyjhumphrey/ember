module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view that resource');
        // Add a redirect here
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        // res.json('You are already logged in. Please log out to execute this.');
        // // Flash msg to user 
        // res.redirect('/');
    },
    hasAccess: function(req, res, next) {
        if (req.user.id === req.params.userId) {
            return next();
        } 
        res.json('DENIED! You do not have access to this resource');
    }
}
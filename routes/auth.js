var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { hasAccess, forwardAuthenticated } = require('../config/auth');
const { nextTick } = require('async');

// Find a specific user
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get('/current-user', (req, res) => {    
    res.json({ user: req.user });
});

// Test authentication for a user 
router.post('/test-auth/:userId', hasAccess, (req, res) => {
    res.json('check console');
});

/* Log into an account
    email,
    password
*/
// @NOTE: Send a message when the user trying to log in is already logged in

// router.post('/log-in', (req, res, next) => {
//     console.log('Log in request is making it to the server');
//     if (req.user) {
//         console.log('However, the user has already been logged in');
//     }

//     passport.authenticate('local', (err, user, info) => {
//         console.log('passport.authenticate');
//         console.dir(user);

//         // Casing
//         if (err) { return next(err); }
//         if (!user) { return res.json({ err: "Invalid Credentials", success: false }); }
        
//         req.logIn(user, function (err) {
//             console.log('req.login');

//             console.log(user);

//             if (err) { console.log(err); return next(err); }
//             return res.json({ message: "Logged In!", success: true, user: req.user });
//         });
//     })(req, res, next);
// });

router.post('/log-in', passport.authenticate('local'), (req, res) => {
    res.json({ message: "Logged In!", success: true, user: req.user });
});


// Create an account
router.post('/create-account', async (req, res, next) => {
    try {
        let { username, email, password, confirmPassword } = req.body;
        let errors = [];
        
        // Make sure all of the data is there
        if (!username) errors.push("No username entered");
        if (!email) errors.push("No email entered");
        if (!password) errors.push("No password entered");
        if (!confirmPassword) errors.push("No confirm password entered");

        // Make sure the email is free
        const emailUser = await User.findOne({ email: email });
        if (emailUser) errors.push("That email is already in use");

        // Make sure the username is free
        const usernameUser = await User.findOne({ username: username });
        if (usernameUser) errors.push("That username is already in use");

        // See if the password match
        if (password != confirmPassword) errors.push("Passwords do not match");

        // Throw the errors
        if (errors.length > 0) throw errors;

        // If validated, create the user
        const newUser = new User(req.body);
        const savedUser = await newUser.save();

        // Log the user in
        passport.authenticate('local', (err, user, info) => {
            // Casing
            if (err) { return next(err); }
            if (!user) { return res.json({ err: "Invalid Credentials", success: false }); }

            req.logIn(user, function (err) {

                if (err) { return next(err); }
                return res.json({ message: "Account Created! You are now logged in!", success: true, user: req.user });
            });
        })(req, res, next);
    } catch (errors) {
        console.error(errors);
        res.json({ errors: errors, success: false });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.logout();
    res.json({ success: true, message: "Logged out", user: {} });
});

module.exports = router;

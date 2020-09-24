const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/User');
const passport = require('passport');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            // Find a user 
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    console.log(password, user.password);
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            });
        })
    );
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
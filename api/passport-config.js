const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    try {
      const user = getUserByUsername(username);
    } catch (err) {
      console.log(err);
    }
    if (user == null) return done(null, false, { message: 'No user with that username' });

    console.log(user);

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (err) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.serializeUser((id, done) => done(null, getUserById(id)));
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

module.exports = initialize;

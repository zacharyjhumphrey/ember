const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
require('dotenv/config');

const app = express();

/*
    GOAL FOR TODAY:
    CONFIGURE THE ROUTES FOR THE SEARCH BACKEND (Really, it's just gonna be the author, so that's not gonna be hard)
*/

// Connect to database
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true }, () => {
    console.log('Connected to database')
});

// Passport Config 
require('./config/passport')(passport);

// Mongoose Objects 
const User = require('./models/User');

// // Middlewares
// CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}));
app.use(express.urlencoded({ extended: true }));

// Body Parsing
app.use(express.json());

// Sessions
app.use(session({
  secret: 'my left nut',
  resave: true,
  maxAge: new Date(Date.now() + 3600000),
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport 
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/search', require('./routes/search'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));


// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(8080);

// // connect to database
// mongoose.connect(process.env.DB_CONNECTION, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true }, () => {
//     console.log('Connected to database')
// });

// TODO:
// Frontend TODO:
// Username hover animation + view user in search on click
// Animate login and createaccount
// Make Create Account and Log In underline
// Log In
// Change account icon when user is logged in

//  Backend TODO:

// OAUTH

// Before Deployment: 
// XSS Sanitation
// User Authentication to CRUD operations

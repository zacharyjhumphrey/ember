const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
require('dotenv/config');

const app = express();

/*
    GOALS FOR TODAY:
    Combine the two folders so that they can run in Heroku
        1. Need to create a package.json command that will run both servers on Heroku
        - COMPLETED - 2. Need to create a command to build the react app
    
    Find a way to update packages on github as needed: 

    Clear database and create more relevant posts for recruiters to see what's going on in the app: 
      1. Clear all of the database
      2. Create three users
      3. Create four posts
      4. Comment on all posts as different users
      5. Upvote/downvote different posts as different users 
        a. Make sure that unauthenticated users can't log in


    FUTURE GOALS:   
    Implement the message system:
      For example: Send a message to the user that they are not logged in. 
    
    Fix memory leak: 
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
// app.use(cors({ credentials: true, origin: 'http://localhost:3000'}));
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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/search', require('./routes/search'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));


// Routing to the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(process.env.PORT || 8080);

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

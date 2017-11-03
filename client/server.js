// Instastore
// client/server.js
// Anthony Krivonos
// 10/16/2017

// Global Imports
const open = require("openurl");
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const environment = require('../environment.js');
// Local Imports
const Users = require('./users.js');

// Local Variables
let port = process.env.PORT || environment.client.port || '8081';

// Auth Serve

user = {
      username: 'test',
      password: 'test'
};

// Register a login strategy
passport.use('login', new LocalStrategy(
      function(username, password, done) {
            console.log("Trying.");
            Users.login({username, password}).then(() => {
                  console.log("Logging in.");
                  return done(null, user);
            }).catch(() => {
                  console.log("Could not log in.");
                  return done(null, false, {message:"Could not log in."});
            });
      }
));

// Required for storing user info into session
passport.serializeUser(function(user, done) {
      done(null, user._id);
});

// Required for retrieving user from session
passport.deserializeUser(function(id, done) {
      done(null, user);
});

module.exports = passport;

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', express.static(environment.client.app_dir, {extensions: ['html']}));
app.use(session({
      secret: 'instastore',
      saveUninitialized: true,
      resave: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Login Function

app.get('/', function(req, res) {
      console.log(`User: ${req.user}`);
      if(!req.user) {
            redirect('/login')
      } else redirect('/');
});

app.post('/login',
      passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
      })
);

app.post('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
      console.log("Logging out.");
});

app.listen(port, () => {
      console.log(`Instastore client listening on port ${port}.`);
});

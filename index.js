const express = require('express')
const app = express()
const port = 3000

const config = require('./config/config');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');

/* connect to mongo db */
mongoose.connect(config.database);

const User = require("./models/user");
const FacebookStrategy = require('passport-facebook').Strategy;

/* configure express */
app.use(passport.initialize());
app.use(passport.session());

/* configure passport to work with Facebook */
passport.use(new FacebookStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: '/return',
    profileFields: ['id', 'displayName', 'photos', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile); // callback
  }
));

/* passport serialize and deserialize methods */
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/* OAuth account route */
app.get('/account/', passport.authenticate('facebook', { scope: ['email']}));

/* OAuth Callback URL */
app.get('/return', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  const names = req.user.displayName.split(' ');
  const email = req.user._json.email;

  var newUser = new User({
    firstName: names[0],
    lastName: names[1],
    email: email
  });
  newUser.save(function(err, user) {
    if (user) {
      res.redirect('/success');
    } else {
      res.redirect('/error');
    }
  });
});

/* success route */
app.get('/success', (req, res) => res.send('Successfully logged in!'))

/* error route */
app.get('/error', (req, res) => res.send('Error'))

/* app listen on port */
app.listen(port, () => console.log(`OAuth app listening on port ${port}!`))

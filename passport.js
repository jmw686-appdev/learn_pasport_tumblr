const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const TumblrStrategy = require('passport-tumblr').Strategy;
const User = require('./models/user');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(user, done) {
    User.findById(_id, function (err, user) {
      done(err, user);
    });
});

// local auth
passport.use(new localStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      user.comparePassword(password, user.password, function (err, isMatch) {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false); }
        return done(null, user);
      });
    });
  }
));

// tumblr auth
passport.use(new TumblrStrategy({
    consumerKey: process.env.TUMBLR_CONSUMER_KEY,
    consumerSecret: process.env.TUMBLR_SECRET_KEY,
    callbackURL: "http://localhost:3000/auth/tumblr/callback"
  },
  function(token, tokenSecret, user, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Tumblr profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Tumblr account with a user record in your database,
      // and return that user instead.
      // TODO find current user and save the username, access_token, and access_secret
      console.log(user);
      return done(null, user);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/users/login');
}
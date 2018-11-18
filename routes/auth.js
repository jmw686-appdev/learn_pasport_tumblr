const express = require('express');
const router = express.Router();
require('../passport');
const connect = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');


// tumblr auth

router.get('/tumblr',
  passport.authenticate(['local', 'tumblr']));

router.get('/tumblr/callback',
  passport.authenticate('tumblr', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/users/');
});


module.exports = router;

const express = require('express');
const router = express.Router();
require('../passport');
const connect = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');


// tumblr auth

router.get('/tumblr',
  passport.authenticate(['local', 'tumblr']));

// router.get('/tumblr/callback',
//   passport.authenticate('tumblr', { failureRedirect: '/users/login' }),
//   function(req, res) {
//     console.log(req.body);
//     console.log(res.params);
//     // Successful authentication, redirect home.
//   });

router.get('/tumblr/callback',function (req, res) {
  current_user = req.user;
  console.log(req.query);
  access_token = req.query.oauth_token
  access_secret = req.query.oauth_verifier
  User.findOneAndUpdate({_id: current_user.id }, {access_token: access_token, access_secret: access_secret}, options, (error, doc) => {
    // error: any errors that occurred
    // doc: the document before updates are applied if `new: false`, or after updates if `new = true`
  });
  res.redirect('/users/');

});

function authCallback(req, res) {
  res.res.cookie('token', JSON.stringify(req.user.token));
  res.redirect('/');
}

module.exports = router;

const express = require('express');
const router = express.Router();
require('../passport');
const connect = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');

/* GET users listing. */
router.get('/', connect.ensureLoggedIn('/users/login'), function(req, res, next) {
  User.find({}, function(err, users) {
   res.render('users/index', {users: users});
  });
});

// Login
router.get('/login', function(req, res){
  if (req.user) {
    res.redirect('/users/'); //+ req.user.username)
  }
	res.render('users/sign_in');
});
// Why doesn't this work?
// router.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/users/login' }));

router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successReturnToOrRedirect: '/users',
    failureRedirect: '/users/login'
  }, function(err, user, info) {
    if (err) {console.log(err);}
    console.log(user);
    console.log(info);
    console.log("success");
    res.redirect('/users');
  })(req, res, next); //TODO this right here is the stuff I don't get
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/signup', function(req, res){
	res.render('users/sign_up');
});

router.post('/signup', function(req, res){
  let user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save().then(result => {
    console.log(result);
  }).catch(err => console.log(err));
	res.redirect('/');
});
module.exports = router;

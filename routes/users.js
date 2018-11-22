const express = require('express');
const router = express.Router();
require('../passport');
const connect = require('connect-ensure-login');
const passport = require('passport');
// const tumblr = require('tumblr.js');
const User = require('../models/user');

/* GET users listing. */
router.get('/', connect.ensureLoggedIn('/users/login'), function(req, res, next) {
  User.find({}, function(err, users) {
   res.render('users/index', {users: users});
  });
});

router.get('/likes/:offset', function(req, res){
  // Authenticate via OAuth
  let offset = req.params.offset
  var tumblr = require('tumblr.js');
  let client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
    token: req.user.access_token,
    token_secret: req.user.access_secret
  });

  likes = []
  // Show user's blog likes

  client.userLikes({offset: offset}, function(err, data) {
    console.log(err);
    if (!err) {
      console.log(data.liked_posts)
      likes = [...data.liked_posts]
      res.render("users/likes", {likes: likes, offset: (parseInt(offset) + 20) });
    }
    else {
      console.log(req.user.access_token);
      console.log(req.user.access_secret);
    }
  });
});
// Login
router.get('/login', function(req, res){
  if (req.user) {
    res.redirect('/users/'); //+ req.user.username)
  }
	res.render('users/sign_in');
});

router.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/users/login' }));


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

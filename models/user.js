// make this available to our users in our Node applications
const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  access_token: { type: String },
  access_secret: { type: String }
});


userSchema.pre('save', function(next) {
    var user = this;

    this.hashPassword(user.password, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
    // only hash the password if it has been modified (or is new)
    // if (!user.isModified('password')) return next();
});

//Hash Password
userSchema.methods.hashPassword = function (candidatePassword, cb) {
  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return cb(err);
    // hash the password using our new salt
    bcrypt.hash(candidatePassword, salt, function(err, hash) {
      if (err) return cb(err);
      cb(null, hash);
    });
  });

}

userSchema.methods.comparePassword = function(candidatePassword, hash, cb) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema);

const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../models/user");


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
          User.findOne({ email: email }).then((user) => {
            console.log(user)
            if (!user) {
              return done(null, false, { message: "Incorrect email" });
            }
      
            bcrypt.compare(password, user.password, (err, matched) => {
              if (err) return err;
              if (matched) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect Password" });
              }
            });
          });
        })
      );
      

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

 
};

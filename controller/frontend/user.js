const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { sendMail } = require("../../helpers/mail");
const nodemailer = require("nodemailer");
const { validationResult } = require('express-validator');

exports.getLogin = async (req, res, next) => {
  try {
    if (res.locals.user) {
      res.redirect("/");
    } else {
      res.render("frontend/user/login", {
        title: "login",
      
      });
    }
  } catch (error) {
    next(error);
  }
};

// passport.use(
//   new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//     User.findOne({ email: email }).then((user) => {
//       if (!user) {
//         return done(null, false, { message: "Incorrect email" });
//       }

//       bcrypt.compare(password, user.password, (err, matched) => {
//         if (err) return err;
//         if (matched) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: "Incorrect Password" });
//         }
//       });
//     });
//   })
// );

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });
exports.postLogin = async (req, res, next) => {
  try {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
     console.log(errors.array())
     return res.status(422).render("frontend/user/login", {
      title: "login",
      error_message:errors.array()[0].msg
    });
   }
    User.findOne({ email: req.body.email }).then((user) => {
      let errors = [];
      if(user){
        if (user.role != req.body.role) {
          errors.push({ message: "You are not permitted to access" });
        }
        if (user.email != req.body.email) {
          errors.push({ message: "You are not registered" });
        }
      }
     
      if (errors.length > 0) {
        res.render("frontend/user/login", {
          errors: errors,
        });
      } else {
        if (req.body.role != "admin") {
          passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/user/login/",
            failureFlash: true,
          })(req, res, next);
        } else {
          passport.authenticate("local", {
            successRedirect: "/admin",
            failureRedirect: "/user/login/",
            failureFlash: true,
          })(req, res, next);
        }
      }
    });
  } catch (err) {
    next(new Error(err));
  }
};
exports.logout = async (req, res, next) => {
  try {
    req.logout();
    req.flash("success_msg", "You are loged out");
    res.redirect("/user/login");
  } catch (error) {
    next(error);
  }
};

exports.getRegister = async (req, res, next) => {
  try {
    res.render("frontend/user/register", {
      title: "register",
      firstName: "",
      lastName: "",
      email: "",
    });
  } catch (error) {
    next(error);
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    let errors = [];
    if (!req.body.firstName) {
      errors.push({ message: "first Name required" });
    }
    if (!req.body.lastName) {
      errors.push({ message: "last Name required" });
    }
    if (!req.body.email) {
      errors.push({ message: "email required" });
    }
    if (!req.body.password) {
      errors.push({ message: "password required" });
    }
    if (req.body.password != req.body.passwordConfirm) {
      errors.push({ message: "password not Matched" });
    }
    if (errors.length > 0) {
      res.render("frontend/user/register", {
        errors: errors,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      });
    } else {
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
          });
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
              user.password = hash;
              user.save().then((saved) => {
                req.flash("success_message", "please login ");
                res.redirect("/user/login");
              });
            });
          });
        } else {
          req.flash("error_message", "User exist");

          res.redirect("/user/register");
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getForgetPassword = async (req, res, next) => {
  try {
    res.render("frontend/user/ForgetPassword", {
      title: "Forget Password",
    });
  } catch (error) {
    next(error);
  }
};

exports.postForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    User.findOne({ email: email }).then((user) => {
      console.log(user);

      if (!user) {
        req.flash(
          "error_message",
          "No user found. Please check the username and try again"
        );
        res.redirect("/user/ForgetPassword");
      }
      const resetToken = crypto.randomBytes(20).toString("hex"),
        resetPasswordExpires = Date.now() + 3600000; // 1 hr
      // Mail
      const link = "http://" + req.headers.host + "/user/reset/" + resetToken;

      const text = `Hi ${user.firstName} \n
    	    Please click on the following link ${link} to reset your password. \n\n
    	    If you did not request this, please ignore this email and your password will remain unchanged.\n`;

      req.flash(
        "success_message",
        `Resend link is sent to your mail. Please check your email (${user.email})`
      );
      return res.redirect("/user/ForgetPassword");
    });
  } catch (error) {
    next(error);
  }
};

exports.reset = async (req, res, next) => {
  try {
    const { resetToken } = req.params;

    if (!resetToken) {
      req.flash("error_message", `Invalid or expired token provided`);
      return res.redirect("/user/ForgetPassword");
    }

    return res.render("frontend/user/resetPassword");
  } catch (error) {
    req.flash("error", error.message.message);
    res.redirect("/login/recovery");
    next(error.message);
  }
};

exports.resetPost = async (req, res, next) => {
  try {
    const id = "61df97883379a5cc21594b61";
    User.findById({ _id: id }).then((user) => {
      console.log(user);
      let pass = req.body.password;
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.confPassword, salt, function (err, hash) {
          bcrypt.compare(pass, req.body.confPassword, function (err, rest) {
            if (rest) {
              user.password = hash;
              user.save().then((saved) => {
                req.flash("success_message", "Password Updated Successfuly.. ");
                res.redirect(`/user/reset/${id}`);
              });
            } else {
              req.flash("error_message", "passwords do not match.. ");
              res.redirect(`/user/reset/${id}`);
            }
          });
        });
      });
    });
  } catch (error) {
    req.flash("error", error.message.message);
    res.redirect("/login/recovery");
    next(error.message);
  }
};
exports.getChangePassword = async (req, res, next) => {
  try {
    res.render("frontend/user/changePassword", {
      title: "changePassword",
    });
  } catch (error) {
    next(error);
  }
};

exports.postChangePassword = async (req, res, next) => {
  try {
    User.findById({ _id: req.params.id }).then((user) => {
      console.log(user);
      let pass = req.body.oldPassword;
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.newPassword, salt, function (err, hash) {
          bcrypt.compare(pass, user.password, function (err, rest) {
            if (rest) {
              user.password = hash;
              user.save().then((saved) => {
                req.flash("success_message", "Password Updated Successfuly.. ");
                res.redirect("/user/getChangePassword");
              });
            } else {
              req.flash("error_message", "passwords do not match.. ");
              res.redirect("/user/getChangePassword");
            }
          });
        });
      });
    });
  } catch (error) {
    next(error);
  }
};
exports.profile = async (req, res, next) => {
  try {
    User.findById({ _id: req.params.id }).then((user) => {
     
      res.render("frontend/user/profile", {
        user: user,
      });
     
    });
     
    
  } catch (error) {
    next(error);
  }
};
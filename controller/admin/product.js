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

exports.getProduct = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
      let count;
      Product.count(function (err, c) {
        count = c;
      });

      Product.find(function (err, products) {
        res.render("admin/product/product", {
          products: products,
          count: count,
        });
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAddProduct = async (req, res, next) => {
  try {
    res.render("admin/product/addProduct", {
      title: "Product",
      firstName: "",
      lastName: "",
      email: "",
    });
  } catch (error) {
    next(error);
  }
};

exports.postAddProduct = async (req, res, next) => {
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

exports.getEditProduct = async (req, res, next) => {
  try {
    res.render("admin/product/editProduct", {
      title: "Forget Password",
    });
  } catch (error) {
    next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
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

exports.deleteProduct = async (req, res, next) => {
  try {
    res.render("frontend/user/changePassword", {
      title: "changePassword",
    });
  } catch (error) {
    next(error);
  }
};

const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Comment = require("../../models/comment");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { sendMail } = require("../../helpers/mail");
const nodemailer = require("nodemailer");
exports.getComment = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
      let count;
      Comment.count(function (err, c) {
        count = c;
      });

      Comment.find(function (err, comments) {
        res.render("admin/comment/comment", {
          comments: comments,
          count: count,
        });
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.approveComment = async (req, res, next) => {
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

exports.deleteComment = async (req, res, next) => {
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

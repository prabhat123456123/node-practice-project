const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
const subCategory = require("../../models/subCategory");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { sendMail } = require("../../helpers/mail");
const nodemailer = require("nodemailer");

exports.getSubCategory = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
      let count;
      subCategory.count(function (err, c) {
        count = c;
      });

      subCategory.find(function (err, subCategories) {
        res.render("admin/subCategory/subCategory", {
            subCategories: subCategories,
          count: count,
        });
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAddSubCategory = async (req, res, next) => {
  try {
    Category.find(function (err, categories) {
    res.render("admin/subCategory/addSubCategory", {
      title: "",
      categories:categories
    });
    });
  } catch (error) {
    next(error);
  }
};

exports.postAddSubCategory = async (req, res, next) => {
  try {
    let category = req.body.category;
    let title = req.body.title;
    let slug = req.body.title.replace(/\s+/g, "-").toLowerCase();

    subCategory.findOne({ slug: slug }).then((subCategories) => {
      if (!subCategories) {
        const subCat = new subCategory({
            Category:category,
          title: title,
          slug: slug,
        });

        cat.save().then((saved) => {
          req.flash("success_message", "SubCategory Added ");
          res.redirect("/admin/subCategory");
        });
      } else {
        req.flash("error_message", "SubCategory Slug Exist");
        res.redirect("/admin/subCategory");

        // res.render("admin/category/addCategory", { title: title });
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getEditSubCategory = async (req, res, next) => {
  try {
    res.render("admin/subCategory/editSubCategory", {
      title: "Forget Password",
    });
  } catch (error) {
    next(error);
  }
};

exports.postEditSubCategory = async (req, res, next) => {
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

exports.deleteSubCategory = async (req, res, next) => {
  try {
    res.render("frontend/user/changePassword", {
      title: "changePassword",
    });
  } catch (error) {
    next(error);
  }
};

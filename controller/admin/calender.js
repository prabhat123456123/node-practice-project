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
const formidable = require("formidable");
const nodemailer = require("nodemailer");
const Calender = require("../../models/calender");

exports.event = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
     
        Calender.find(function (err, cald) {
            res.render("admin/calender", {
                cald: cald,
              
            });
           
          });
 
    }
  } catch (error) {
    next(error);
  }
};

exports.addEvent = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, async (error, fields, files) => {
    let title = fields.title;
    let startDate = fields.startDate;
    let endDate = fields.endDate;

   
     
        const calender = new Calender({
          title: title,
          startDate: startDate,
          endDate:endDate
        });

        calender.save().then((saved) => {
          req.flash("success_message", "Event Added ");
          res.redirect("/admin/calender");
        });
    });
  
  } catch (error) {
    next(error);
  }
};


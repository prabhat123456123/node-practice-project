const express = require("express");
const router = express.Router();
// const Category = require("../models/category");

exports.getLogin = async (req, res, next) => {
  try {
    res.render("frontend/user/login", {
      title: "login",
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    res.render("frontend/user/login", {
      title: "login",
    });
  } catch (error) {
    next(error);
  }
};
exports.getRegister = async (req, res, next) => {
  try {
    res.render("frontend/user/register", {
      title: "register",
    });
  } catch (error) {
    next(error);
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    res.render("frontend/user/register", {
      title: "register",
    });
  } catch (error) {
    next(error);
  }
};

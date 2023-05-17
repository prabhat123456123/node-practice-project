const express = require("express");
const router = express.Router();



exports.error404 = async (req, res, next) => {
    try {
      res.status(404).render("404");
    } catch (error) {
      next(error);
    }
  };


exports.error500 = async (req, res, next) => {
  try {
    res.status(500).render("500");
  } catch (error) {
    next(error);
  }
};

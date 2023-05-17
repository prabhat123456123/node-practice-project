const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Question = require("../../models/question");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { sendMail } = require("../../helpers/mail");
const nodemailer = require("nodemailer");

exports.singleTest = async (req, res, next) => {
  try {
    let count;
    Question.count(function (err, c) {
      count = c;
    });

    Question.find().limit(1).exec(function(err, question){
      Question.find().exec(function(err, questions){
      res.render("frontend/test/singleTest", {
        questions: questions,
        question:question,
        count: count,
      });
    });
  });
   
     
    
  } catch (error) {
    next(error);
  }
};

exports.singleQuestion = async (req, res, next) => {
  try {

   
    let count;
    Question.count(function (err, c) {
      count = c;
    });
console.log(req.body.id);
    Question.find({_id:req.body.id}).exec(function(err, question){
     
      Question.find().exec(function(err, questions){
       
      res.send({
        questions: questions,
        question:question,
        count: count,
      });
    });
  });
   
     
    
  } catch (error) {
    next(error);
  }
};
exports.viewSolution = async (req, res, next) => {
  try {
   
      res.render("frontend/test/viewSolution", {
        title: "login", 
      });
    
  } catch (error) {
    next(error);
  }
};
exports.viewMarks = async (req, res, next) => {
  try {
   
      res.render("frontend/test/viewMarks", {
        title: "login", 
      });
    
  } catch (error) {
    next(error);
  }
};
exports.saveQuestion = async (req, res, next) => {
  try {
  
    let count;
    Question.count(function (err, c) {
      count = c;
    });
console.log(req.body.id);
    Question.findById({_id:req.body.id}).exec(function(err, questiont){
      questiont.status = "saved";
      const ct = questiont.count+1;
      questiont.save().then((saved)=>{
        console.log("saved")
      });
      Question.find({count:ct}).exec(function(err, question){
      Question.find().exec(function(err, questions){
       
      res.send({
        questions: questions,
        question:question,
        count: count,
      });
    });
  });
  });
    
  } catch (error) {
    next(error);
  }
};
exports.prevQuestion = async (req, res, next) => {
  try {
  
    let count;
    Question.count(function (err, c) {
      count = c;
    });

    Question.findById({_id:req.body.id}).exec(function(err, questiont){
     
      const ct = questiont.count-1;
      Question.find({count:ct}).exec(function(err, question){
      Question.find().exec(function(err, questions){
       
      res.send({
        questions: questions,
        question:question,
        count: count,
      });
    });
  });
  });
    
  } catch (error) {
    next(error);
  }
};
exports.DeleteQuestion = async (req, res, next) => {
  try {
   
    let count;
    Question.count(function (err, c) {
      count = c;
    });

    Question.findById({_id:req.body.id}).exec(function(err, question){
      question.status = "notSaved";
      question.save().then((saved)=>{
        console.log("clear")
      });
      Question.find().exec(function(err, questions){
       
      res.send({
        questions: questions,
        question:question,
        count: count,
      });
    });
  });
    
  } catch (error) {
    next(error);
  }
};

const express = require("express");
const router = express.Router();
const Question = require("../../models/question");
const Subject = require("../../models/subject");
const Exam = require("../../models/exam");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs= require("fs");
const PDFDocument = require('pdfkit');
const formidable = require("formidable");
const XLSX = require("xlsx");
const excelJS = require('exceljs');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { sendMail } = require("../../helpers/mail");
const nodemailer = require("nodemailer");

exports.getSubject = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
      let count;
      Subject.count(function (err, c) {
        count = c;
      });

      Subject.find(function (err, subjects) {
        
        res.render("admin/subject/subject", {
            subjects: subjects,
          count: count,
        });
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAddSubject = async (req, res, next) => {
  try {
    res.render("admin/subject/addSubject", {
      title: "",
    
    });
  } catch (error) {
    next(error);
  }
};

exports.postAddSubject = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.multiples = true;
		form.parse(req, async (error, fields, files) => {
    
    let title = fields.title;
    let slug = title.replace(/\s+/g,"-").toLowerCase();
  
  Subject.findOne({slug:slug},(err,subject)=>{
    if(subject){
      req.flash("error_message","Subject Title Exist")
      res.redirect("/admin/test/subject");

    }else{
    
        const subject = new Subject({
          title:title,
          slug:slug,
         
        });
        subject.save((err)=>{
          if(err)
          console.log(err);
          req.flash("success_message","Subject Added");
          res.redirect("/admin/test/subject");
        })
     

    
    
    }
  });



   
  
  });
  } catch (error) {
    next(error);
  }
};

exports.getExam = async (req, res, next) => {
    try {
      if (!res.locals.user) {
        res.redirect("/user/login");
      } else {
        let count;
        Exam.count(function (err, c) {
          count = c;
        });
  
        Exam.find(function (err, exams) {
          
          res.render("admin/exam/exam", {
            exams: exams,
            count: count,
          });
        });
      }
    } catch (error) {
      next(error);
    }
  };
  
  exports.getAddExam = async (req, res, next) => {
    try {
      res.render("admin/exam/addExam", {
        title: "",
        slug: "",
        examDate :"",
             examDuration :"",
             totalQuestion :"",
             examStatus :"",
             level:"",
             examCode :"",
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.postAddExam = async (req, res, next) => {
    try {
      const form = new formidable.IncomingForm();
          form.keepExtensions = true;
          form.multiples = true;
          form.parse(req, async (error, fields, files) => {
      
      let title = fields.title;
      let slug = title.replace(/\s+/g,"-").toLowerCase();
      let examDate =fields.examDate;
      let examDuration =fields.examDuration;
      let totalQuestion =fields.totalQuestion;
      let examStatus =fields.examStatus;
      let level =fields.level;
      let examCode =fields.examCode;
    
    Exam.findOne({slug:slug},(err,exam)=>{
      if(exam){
        req.flash("error_message","Exam Title Exist")
        res.redirect("/admin/test/exam");
  
      }else{
      
          const exam = new Exam({
            examTitle:title,
            slug:slug,
             examDate :examDate,
             examDuration :examDuration,
             totalQuestion :totalQuestion,
             examStatus :examStatus,
             level:level,
             examCode :examCode,
           
          });
          exam.save((err)=>{
            if(err)
            console.log(err);
            req.flash("success_message","Exam Added");
            res.redirect("/admin/test/exam");
          })
       
  
      
      
      }
    });
  
  
  
     
    
    });
    } catch (error) {
      next(error);
    }
  };

  exports.getQuestion = async (req, res, next) => {
    try {
      if (!res.locals.user) {
        res.redirect("/user/login");
      } else {
        let count;
        Question.count(function (err, c) {
          count = c;
        });
  
        Question.find(function (err, questions) {
          
          res.render("admin/question/question", {
            questions: questions,
            count: count,
          });
        });
      }
    } catch (error) {
      next(error);
    }
  };
  
  exports.getAddQuestion = async (req, res, next) => {
    try {
        Exam.find(function (err, exams) {
            Subject.find(function (err, subjects) {
            
                Question.find().sort({ _id: -1 }).limit(1).exec(function(err, question){
                  if(question.length==0){
                    res.render("admin/question/addQuestion", {
                      subjects: subjects,
                    exams: exams,
                    question:1,
                    title: "",
                    slug: "",
                    option1:"",
                        option2:"",
                        option3:"",
                        option4:"",
                        option5:"",
                        rightOption:"",
                        rightMarks:"",
                        wrongMarks:""
                  });
                  }else{
                    res.render("admin/question/addQuestion", {
                      subjects: subjects,
                    exams: exams,
                    question:question,
                    title: "",
                    slug: "",
                    option1:"",
                        option2:"",
                        option3:"",
                        option4:"",
                        option5:"",
                        rightOption:"",
                        rightMarks:"",
                        wrongMarks:""
                  });
                  }
            res.render("admin/question/addQuestion", {
                subjects: subjects,
              exams: exams,
              question:question,
              title: "",
              slug: "",
              option1:"",
                  option2:"",
                  option3:"",
                  option4:"",
                  option5:"",
                  rightOption:"",
                  rightMarks:"",
                  wrongMarks:""
            });
          });
        });
        });
    
    } catch (error) {
      next(error);
    }
  };
  
  exports.postAddQuestion = async (req, res, next) => {
    try {
      const form = new formidable.IncomingForm();
          form.keepExtensions = true;
          form.multiples = true;
          form.parse(req, async (error, fields, files) => {
      
      let title = fields.title;
      let slug = title.replace(/\s+/g,"-").toLowerCase();
      let cnt= fields.cnt;
      let option1= fields.option1;
      let option2= fields.option2;
      let option3= fields.option3;
      let option4= fields.option4;
      let option5= fields.option5;
      let rightOption= fields.rightOption;
      let rightMarks= fields.rightMarks;
      let wrongMarks= fields.wrongMarks;
    
      Question.findOne({slug:slug},(err,question)=>{
        // console.log(question.count);
      if(question){
        req.flash("error_message","Question Title Exist")
        res.redirect("/admin/test/question");
  
      }else{
         const question = new Question({
            questionTitle:title,
            count:cnt,
            slug:slug,
            option1:option1,
            option2:option2,
            option3:option3,
            option4:option4,
            option5:option5,
            rightOption:rightOption,
            rightMarks:rightMarks,
            wrongMarks:wrongMarks

           
          });
          question.save((err)=>{
            if(err)
            console.log(err);
            req.flash("success_message","Question Added");
            res.redirect("/admin/test/question");
          })
  
      }
    });
  
  
  
     
    
    });
    } catch (error) {
      next(error);
    }
  };




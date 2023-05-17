const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Page = require("../../models/page");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const fs= require("fs");
const path= require("path");

const passport = require("passport");
const formidable = require("formidable");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const { sendMail } = require("../../helpers/mail");
const nodemailer = require("nodemailer");

exports.getPage = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
      let count;
      Page.count(function (err, c) {
        count = c;
      });

      Page.find(function (err, pages) {
        res.render("admin/page/page", {
          pages: pages,
          count: count,
        });
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.getPageList = async (req, res, next) => {
  try {
    
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
      let count;
      Page.count(function (err, c) {
        count = c;
      });

      Page.find({ 
        limit: parseInt(req.body.length),
        offset: parseInt(req.body.start)
      }).exec().then(pages=>{
        for (let i = 0; i < pages.length; i++) {
          if(pages[i].image===""){
            pages[i]["image"]=`<img src="/image/noimage.png" alt="" width="100px">`
          }else{
            pages[i]["image"]=`<img src="/image/pages/${pages[i].image}" alt="" width="100px">`
          }
          pages[i]["title"]=pages[i].title,
          
      
          pages[i]["edit"]=`<a href=/admin/page/getEditPage/${pages[i].id}>Edit</a>`,
          pages[i]["delete"]=`<a href="/admin/page/deletePage/${pages[i].id}">Delete</a>`
         
      
         console.log(pages)
        }
        const data = JSON.stringify({
          draw: parseInt(req.body.draw),
          recordsFiltered: count,
          recordsTotal: count,
          data: pages.length ? pages : [],
        });
        return res.send(data);
        
      })

       
    
    }
  } catch (error) {
    next(error);
  }
};
exports.getAddPage = async (req, res, next) => {
  try {
    res.render("admin/page/addPage", {
      title: "",
      slug: "",
      content: "",
     
    });
  } catch (error) {
    next(error);
  }
};

exports.postAddPage = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.multiples = true;
		form.parse(req, async (error, fields, files) => {
    
    let title = fields.title;
    let slug = fields.slug.replace(/\s+/g,"-").toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g,"-").toLowerCase();
    let content = fields.content;
    let imageFile =files.image.originalFilename;
   
    if(imageFile){

      if (
        files.image.mimetype === "image/jpg" ||
        files.image.mimetype === "image/png" ||
        files.image.mimetype === "image/jpeg"
      ) {
    Page.findOne({slug:slug},(err,page)=>{
      if(page){
        req.flash("error_message","Page Exist")
        res.redirect("/admin/page");

      }else{
        if (imageFile != "") {
          var date = new Date();
      var dir = `./public/image/pages`;
				//this will create the folder if not exists
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
      var oldpath = files.image.filepath;
      var imgName = date.getTime() + "_" + imageFile;
     
      var newpath = dir + "/" + imgName;
   
      fs.rename(oldpath, newpath, async error => {
        if (error) {
          console.error(error);
        }
      });
        }
        const page = new Page({
          title:title,
          slug:slug,
          content:content,
          sorting:100,
          image:imgName
        });
        page.save((err)=>{
          if(err)
          console.log(err);
          req.flash("success_message","Page Added");
          res.redirect("/admin/page");
        })
      }
    });
  }else{
    req.flash("error_message","File Not Allowed")
    res.redirect("/admin/page");
  }
}else{
  Page.findOne({slug:slug},(err,page)=>{
    if(page){
      req.flash("error_message","Page Exist")
      res.redirect("/admin/page");

    }else{
     
      const page = new Page({
        title:title,
        slug:slug,
        content:content,
        sorting:100,
        image:""
      });
      page.save((err)=>{
        if(err)
        console.log(err);
        req.flash("success_message","Page Added");
        res.redirect("/admin/page");
      })
    }
  });
}
  });
  
  } catch (error) {
    next(error);
  }
};

exports.getEditPage = async (req, res, next) => {
  try {
    Page.findOne({ _id: req.params.id }, (err, page) => {
      res.render("admin/page/editPage", {
        title: page.title,
        slug: page.slug,
        content: page.content,
        image: page.image,
        id: page._id,
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.postEditPage = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.multiples = true;
		form.parse(req, async (error, fields, files) => {
    let title = fields.title;
  let slug = fields.slug.replace(/\s+/g, "-").toLowerCase();
  if (slug == "") slug = title.replace(/\s+/g, "-").toLowerCase();
  let content = fields.content;
  let id = req.params.id;
  if (files.image.originalFilename) {
  let imageFile =files.image.originalFilename;
  if (
    files.image.mimetype === "image/jpg" ||
    files.image.mimetype === "image/png" ||
    files.image.mimetype === "image/jpeg"
  ) {
 
      Page.findById(id, (err, page) => {
        page.title = title;
        page.slug = slug;
        page.content = content;

        if (imageFile != "") {
          var date = new Date();
          var dir = `./public/image/pages`;
            //this will create the folder if not exists
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
          var oldpath = files.image.filepath;
          var imgName = date.getTime() + "_" + imageFile;
         
          var newpath = dir + "/" + imgName;
       
          fs.renameSync(oldpath, newpath, async error => {
            if (error) {
              console.error(error);
            }
          });
        }
        page.image = imgName;
        page.save((err) => {
          if (err) throw err;

        
          req.flash("success_message", "page Updated");
        });
        res.redirect("/admin/page/getEditPage/" + page._id);
      });
    }else{
      req.flash("error_message", "file not Allowed");
      res.redirect("/admin/page");
    }
    }else{
      Page.findById(id, (err, page) => {
        page.title = title;
        page.slug = slug;
        page.content = content;

        page.save((err) => {
          if (err) throw err;

        
          req.flash("success_message", "page Updated");
        });
        res.redirect("/admin/page/getEditPage/" + page._id);
      });
    }
  });
  } catch (error) {
    next(error);
  }
};

exports.deletePage = async (req, res, next) => {
  try {
    Page.findByIdAndRemove(req.params.id, (err, page) => {
     
      res.redirect("/admin/page");
    });
   
  } catch (error) {
    next(error);
  }
};
exports.reorderPage = async (req, res, next) => {
  try {
    res.render("frontend/user/changePassword", {
      title: "changePassword",
    });
  } catch (error) {
    next(error);
  }
};

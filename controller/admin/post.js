const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Post = require("../../models/post");
const User = require("../../models/user");
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

exports.getPost = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
      let count;
      Post.count(function (err, c) {
        count = c;
      });

      Post.find(function (err, posts) {
        
        res.render("admin/post/post", {
          posts: posts,
          count: count,
        });
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.getPosts = async (req, res, next) => {
  try {

  
// console.log(req.body['search[value]']);

    const post = await Post.find({title: {$regex: req.body['search[value]'], $options: 'i'}}).skip(req.body.start).limit(req.body.length);
    let plots = []
      for (let i = 0; i < post.length; i++) {
       
        plt = {
          title: post[i].title,
          image: post[i].image,
          edit:`<a href="/admin/post/getEditPost/${post[i].id}" > <button class="btn btn-success">edit</button> </a>`,
          delete:`<a href="/admin/post/deletePost/${post[i].id}" > <button class="btn btn-success">delete</button> </a>`,
       }
plots.push(plt)
      
    }
    
     const data = JSON.stringify({
      draw: parseInt(req.body.draw),
      recordsFiltered: post.length,
      recordsTotal: post.length,
      data: plots.length ? plots : [],
    });
    return res.send(data);
  } catch (error) {
    next(error);
  }
};

exports.getAddPost = async (req, res, next) => {
  try {
    res.render("admin/post/addPost", {
      title: "",
      slug: "",
      content: "",
    });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.multiples = true;
		form.parse(req, async (error, fields, files) => {
     let user=req.user.id;
    let title = fields.title;
    let slug = fields.slug.replace(/\s+/g,"-").toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g,"-").toLowerCase();
    let content = fields.content;
    let imageFile =files.image.originalFilename;
   console.log(slug)
 
   if(imageFile){

    if (
      files.image.mimetype === "image/jpg" ||
      files.image.mimetype === "image/png" ||
      files.image.mimetype === "image/jpeg"
    ) {
    Post.findOne({slug:slug},(err,post)=>{
      if(post){
        req.flash("error_message","Post Exist")
        res.redirect("/admin/post");

      }else{
      
            var date = new Date();
        var dir = `./public/image/posts`;
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
     
          const post = new Post({
            user:user,
            title:title,
            slug:slug,
            content:content,
           
            image:imgName
          });
          post.save((err)=>{
            if(err)
            console.log(err);
            req.flash("success_message","Post Added");
            res.redirect("/admin/post");
          })
       

      
      
      }
    });
  }else{
    req.flash("error_message","File Not Allowed")
    res.redirect("/admin/post");
  }
}else{
  Post.findOne({slug:slug},(err,post)=>{
    if(post){
      req.flash("error_message","Post Exist")
      res.redirect("/admin/post");

    }else{
    
        const post = new Post({
          title:title,
          slug:slug,
          content:content,
         
          image:""
        });
        post.save((err)=>{
          if(err)
          console.log(err);
          req.flash("success_message","Post Added");
          res.redirect("/admin/post");
        })
     

    
    
    }
  });
}


   
  
  });
  } catch (error) {
    next(error);
  }
};

exports.getEditPost = async (req, res, next) => {
  try {
    Post.findOne({ _id: req.params.id }, (err, post) => {
      res.render("admin/post/editPost", {
        title: post.title,
        slug: post.slug,
        content: post.content,
        image: post.image,
        id: post._id,
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.postEditPost = async (req, res, next) => {
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
      Post.findById(id, (err,post) => {
        post.title = title;
        post.slug = slug;
        post.content = content;

      
        var date = new Date();
        var dir = `./public/image/posts`;
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
          post.image = imgName;
        
       
        post.save((err) => {
          if (err) throw err;

        
          req.flash("success_message", "post Updated");
        });
        res.redirect("/admin/post/getEditPost/" + post._id);
      });
    }else{
      req.flash("error_message", "file not Allowed");
      res.redirect("/admin/post");
    }
    }else{
      Post.findById(id, (err,post) => {
        post.title = title;
        post.slug = slug;
        post.content = content;

       
        post.save((err) => {
          if (err) throw err;

        
          req.flash("success_message", "post Updated");
        });
        res.redirect("/admin/post/getEditPost/" + post._id);
      });
    }
  });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    Post.findByIdAndRemove(req.params.id, (err, post) => {
     
      res.redirect("/admin/post");
    });
   
  } catch (error) {
    next(error);
  }
};

exports.excel = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.multiples = true;
		form.parse(req, async (error, fields, files) => {
    let workbook = XLSX.readFile(files.excel.filepath);
    let sheet_namelist = workbook.SheetNames;
    let x = 0;
    sheet_namelist.forEach(element=>{
      let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
      Post.insertMany(xlData,(err,data)=>{
if(err){
  console.log(err)
}else{
  console.log(data);
}
      })
     x++;
    });



    res.redirect("/admin/post");
    });
  } catch (error) {
    next(error);
  }
};

exports.getExcel = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
     

      Post.find(function (err, posts) {
        // Reading our test file
        console.log(posts);

   const workbook = new excelJS.Workbook();  // Create a new workbook
        const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
        const path = "./public/uploads";  // Path to download excel
        // Column for data in excel. key must match data key
        worksheet.columns = [
          { header: "S no.", key: "s_no", width: 10 }, 
          { header: "Title", key: "title", width: 10 },
          { header: "Slug", key: "slug", width: 10 },
          { header: "Content", key: "content", width: 100 },
          { header: "Image", key: "image", width: 100 },
      ];
     // Looping through User data
      let counter = 1;
      posts.forEach((post) => {
        post.s_no = counter;
        worksheet.addRow(post); // Add data in worksheet
        counter++;
      });
      // Making first line in excel bold
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      ['A1', 'B1', 'C1'].map(key => {
        worksheet.getCell(key).fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{ argb:'F08080' }
        };
        });
        ['A3', 'B3', 'C3'].map(key => {
          worksheet.getCell(key).fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{ argb:'eeeeeee' }
          };
          });
        const abc = "Excel is Working perfactly"
        worksheet.mergeCells('A3:C3');
        worksheet.getCell('A3').value = abc
        worksheet.getCell('A3').alignment = { horizontal:'center'} ;

      // fill A2 with yellow dark trellis and blue behind
      worksheet.getCell('A2').fill = {
        type: 'pattern',
  pattern:'solid',
  fgColor:{argb:'F08080'},
      };
        const data = workbook.xlsx.writeFile(`${path}/users.xlsx`)
         .then(() => {
          const filename = path+"/"+ "users.xlsx";
          console.log("done")
          // res.setHeader(
          //   "Content-Type",
          //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          // );
          //  res.setHeader(
          //   "Content-Disposition",
          //   "attachment; filename=" + "users.xlsx"
          // );
          res.redirect("http://localhost:5600/"+"uploads/users.xlsx");
         });
        
        
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getPDF = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      res.redirect("/user/login");
    } else {
     

      Post.find(function (err, posts) {
       

// Create a document
const doc = new PDFDocument();

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
// doc.pipe(fs.createWriteStream('output.pdf'));
doc.pipe(res)
// Embed a font, set the font size, and render some text
doc.fontSize(25)
  .text('Prabhat!', 100, 100);

// Add an image, constrain it to a given size, and center it vertically and horizontally


// Add another page
doc
  .addPage()
  .fontSize(25)
  .text('Here is some vector graphics...', 100, 100);

// Draw a triangle
doc
  .save()
  .moveTo(100, 150)
  .lineTo(100, 250)
  .lineTo(200, 250)
  .fill('#FF3300');

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
doc
  .scale(0.6)
  .translate(470, -380)
  .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
  .fill('red', 'even-odd')
  .restore();

// Add some text with annotations
doc
  .addPage()
  .fillColor('blue')
  .text('Here is a link!', 100, 100)
  .underline(100, 100, 160, 27, { color: '#0000FF' })
  .link(100, 100, 160, 27, 'http://google.com/');



  res.setHeader(
   "Content-Type",
   "application/pdf"
 );
  res.setHeader(
   "Content-Disposition",
   "attachment; filename=" + "output.pdf"
 );

// Finalize PDF file
doc.end()
      });
    }
  } catch (error) {
    next(error);
  }
};
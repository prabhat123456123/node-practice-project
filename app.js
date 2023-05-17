const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const connectDatabse = require('./config/database');
// const csrf = require('csurf')
const bodyParser = require("body-parser");
const session = require("express-session");
// const fileupload = require("express-fileupload");
const flash = require("connect-flash");
const dotenv = require('dotenv');
// const {mongoDbUrl} = require('./config/database');
const formidable = require("formidable");
const Page = require("./models/page");
const Category = require("./models/category");
const passport = require("passport");
const tus = require('tus-node-server');
const EVENTS = require('tus-node-server').EVENTS;
const server = new tus.Server({ path: '/uploads' });
server.datastore = new tus.FileStore({ directory: './public/uploads' });
// console.log(server)
const app = express();

const {
  userAuthenticated,
  adminAuthenticated,
} = require("./helpers/authentication");
const uploadApp = express();
uploadApp.all('*', server.handle.bind(server));
app.use('/uploads', uploadApp);

var player = require('play-sound')(opts = {})

// $ mplayer foo.mp3 
player.play('image/success.mp3', function(err){
  if (err) throw err
})

// server.on(EVENTS.EVENT_FILE_CREATED, (event) => {
//     console.log(`Upload complete for file ${event.file.id}`);
// });

// server.on(EVENTS.EVENT_FILE_DELETED, (event) => {
//     console.log(`Upload complete for file ${event.file.id}`);
// });
// dotenv.config({path:'./.env'})
// connecting to db
connectDatabse();

//db connection
// mongoose.connect(mongoDbUrl).then((db)=>{
//   console.log("connected")
// }).catch(error=>console.log(error));
process.on('uncaughtException',err=>{
  console.log(`ERROR:${err.message}`);
  console.log(`Shutting Down the Server due to Uncaught Exception`);
 
    process.exit(1);
  
});
  
// console.log(a)
//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// const csrfProtection=csrf();
// setup public/static folder
app.use(express.static(path.join(__dirname, "public")));

app.locals.errors = null;

// Page.find({})
//   .sort({ sorting: 1 })
//   .exec((err, pages) => {
//     if (err) {
//       console.log(err);
//     } else {
//       app.locals.pages = pages;
//     }
//   });

// Category.find((err, categories) => {
//   if (err) {
//     console.log(err);
//   } else {
//     app.locals.categories = categories;
//   }
// });
// app.use(fileupload());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);
// app.use(csrfProtection);
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
//local variable using middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  // res.locals.csrfToken = req.csrfToken();

  next();
});
app.use((err,req,res,next)=>{
  err.statusCode = err.statusCode||500;
  if(process.env.NODE_ENV ==="DEVELOPEMENT"){
    return res.status(err.statusCode).json({
      success:false,
      error:err,
      errorMessage:err.message,
      stack:err.stack
    })
  }
  if(process.env.NODE_ENV ==="PRODUCTION"){
    const error = {...err}
    error.message = err.message;
    if(err.name==='CastError'){
      const message = `Resource Not Found with ${err.path}`
      error = new ErrorHandler(message,400);
    }
    if(err.name==='ValidationError'){
      const message = object.values(err.errors).map(value=>value.message)
      error = new ErrorHandler(message,400);
    }
    if(err.code===11000){
      const message = `Duplicate ${object.keys(err.keyValue)} entered`
      error = new ErrorHandler(message,400);
    }
    if(err.name==='JsonWebTokenError'){
      const message = 'json web token is invalid'
      error = new ErrorHandler(message,400);
    }
    if(err.name==='TokenExpiredError'){
      const message = 'json web token is  Expired'
      error = new ErrorHandler(message,400);
    }
    return res.status(err.statusCode).json({
      success:false,
     
      errorMessage:error.message||'internal server error',
     
    })
  }
 
  console.log(err)
})
app.get("*", function (req, res, next) {
  res.locals.cart = req.session.cart;
  next();
});
//setup routes
const user = require("./routes/frontend/user");
const onlineTest = require("./routes/frontend/test");
const adminTest = require("./routes/admin/test");
const admin = require("./routes/admin/admin");
const page = require("./routes/admin/page");
const category = require("./routes/admin/category");
const subCategory = require("./routes/admin/subCategory");

const product = require("./routes/admin/product");
const post = require("./routes/admin/post");
const comment = require("./routes/admin/comment");
const calender = require("./routes/admin/calender");
const error = require("./routes/error");

app.use("/admin/page", page);
app.use("/admin/category", category);
app.use("/admin/subCategory", subCategory);
app.use("/admin/post", post);
app.use("/admin/comment", comment);
app.use("/admin/calender", calender);
app.use("/admin/product", product);
app.use("/user", user);
app.use("/test", onlineTest);
app.use("/admin/test", adminTest);
app.use("/admin", admin);
app.use("/error", error);

app.get("/", (req, res, next) => {
  res.render("frontend/index");
});
app.get("/uppy", (req, res, next) => {
  res.render("admin/upload");
});

app.get("/admin", adminAuthenticated, (req, res, next) => {
  res.render("admin/index");
});
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
//setup server
// const port = 5600;
 app.listen(process.env.PORT,  ()=> {
  console.log(`running on port ${ process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
process.on('unhandledRejection',err=>{
  console.log(`ERROR:${err}`);
  console.log(`Shutting Down the Server due to Unhandled Promise Rejection`);
  server.close(()=>{
    process.exit(1);
  })
});
const http = require('http');
const https = require('https');
const fs = require('fs');

//   const server = http.createServer((req,res)=>{
//     const url = req.url;
//     const method = req.method;
// if(url==="/"){
//     res.setHeader("Content-Type","text/html");
//     res.write("<html>");
//     res.write("<head><title>prabhat</title></head>");
//     res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">submit</button></form></body>');
//     res.write("</html>");
//    return res.end();
// }

// if(url==="/message" && method ==="POST"){
//   const body = [];
//   req.on('data',(chunk)=>{
//     body.push(chunk);
//     console.log(chunk.toString());
//   });
 
//   req.on('end',()=>{
//     const parseBody = Buffer.concat(body).toString();
//     const msg = parseBody.split('=')[1];
//     // console.log(Buffer.concat(body));
//     fs.writeFileSync("message.txt",msg);
//     res.statusCode=302;
//   res.setHeader("Location","/");
//   return res.end();
//   })
  
  
  
// }

// });

// server.listen(3333)
// fs.readdir(".",(err,content)=>{
//   if(err)throw err;
//   console.log(content)
// });
// fs.readFile("test.html","UTF-8",(err,content)=>{
//   if(err)throw err;
//   console.log(content)
// })
// fs.writeFile("test2.html",`\n hello \n`,"UTF-8",(err,content)=>{
//   if(err)throw err;
//   console.log("saved")
// })
// fs.appendFile("test2.html",`\n hello \n`,"UTF-8",(err,content)=>{
//   if(err)throw err;
//   console.log("saved")
// })
// fs.access("./data",(err)=>{
// if(err){
//   console.log("folder does not exist");
//   fs.mkdir("data",(err)=>{
//     if(err)throw err;
//     fs.writeFile("./data/data.txt",`\n hello \n`,"UTF-8",(err,content)=>{
//       if(err)throw err;
//       fs.renameSync("./data/data.txt","./data/data8.txt")
//     })
//   })
// }
// })
// fs.unlinkSync("./data/data.txt");
// fs.rmdirSync("./data");
// fs.renameSync("./db/test2.html","./db/test8.html")

// let url ="https://jsonplaceholder.typicode.com/posts"
// https.get(url,res=>{
//   res.setEncoding("utf8");
//   let body ="";
//   res.on("data",data=>{
//     body += data;
//   })
//   res.on('end',()=>{
//     fs.writeFile('data.json',body,"utf8",err=>{
//       if(err)throw err;
//       console.log("pulled")
//     })
//   })
// })

// http.createServer((req,res)=>{

    // fs.readFile("./test.html", "UTF-8", (err, data) => {
    //   if (err) throw err;
    //   res.writeHead(200, { "contentType": "text/html" });
    //   res.end(data);
    // }
    // )
  // }
  // if(req.url==="/message" && req.method==="POST"){
  // const body = [];
  // req.on('data',(chunk)=>{
  //   body.push(chunk);
   
  // });
 
  // req.on('end',()=>{
  //   const abc = Buffer.concat(body).toLocaleString();
  //   const xyz = abc.split("&");
  //   let element=""
  //   for (let i = 0; i < xyz.length; i++) {
  //      element += xyz[i].split("=")[1];
      
  //   }
  //   fs.writeFile("msg.text", element, "UTF-8", err => {
  //     if (err) throw err;
  //     console.log("written");
  //   })
  //   console.log(xyz);
  //   res.statusCode=302;
  // res.setHeader("Location","/");
  // return res.end();
  // })
  // }
  // else {
  //   res.writeHead(404,{"contentType":"text/plain"});
  //   res.end("not");
  // }
// let url ="https://jsonplaceholder.typicode.com/posts"

//   if(req.method === "GET" && req.url==="/posts"){
// https.get(url,(httpres)=>{
  
//   httpres.on("data",(data)=>{
    
//     httpres.setEncoding("UTF-8");
   
//     res.write(data);
//   })
//   httpres.on('end',(data)=>{
   
//    res.end()
//    console.log("data")

//   })
// })
//   }
// let body = ""
// if(req.method==="GET"){
//   res.writeHead(200,{"Content-Type":"text/html"})
//   fs.readFile("./test.html","utf8",(err,data)=>{
//     if(err) throw err;
//     res.write(data);
//     res.end();
//   })
// }else if(req.method==="POST"){
//   req.on('data',data=>{
//     body += data;
//   })
//   req.on('end',()=>{
//     res.writeHead(200,{"Content-Type":"text/html"})
//     res.write(body,()=>{
//       res.end();
//     });
    
//   })

// }else{
//   res.writeHead(404,{"Content-Type":"text/plain"})
//   res.end("end");
// }
// }).listen(3333)


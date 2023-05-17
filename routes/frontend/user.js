const express = require("express");
const { check } = require('express-validator/check');
const router = express.Router();

const {
  getLogin,
  postLogin,
  getRegister,
  logout,profile,
  postRegister,
  getForgetPassword,
  resetPost,
  reset,
  postForgetPassword,
  postChangePassword,
  getChangePassword,
} = require("../../controller/frontend/user");

router.get("/login", getLogin);
router.get("/logout", logout);
router.post("/postLogin", [check('email').isEmail().withMessage("please Enter Valid Email !!!!")
.custom((value,{req})=>{
if(value==="test@gmail.com"){
  throw new Error("Forbidden");
}
return true;
}),check('password',"pasword greater than 5 and combination of letter and digit")]
,postLogin);

router.get("/register", getRegister);
router.post("/postRegister", postRegister);

router.get("/ForgetPassword", getForgetPassword);

router.post("/ForgetPassword", postForgetPassword);

router.get("/reset/:resetToken", reset);

router.get("/profile/:id", profile);

router.post("/reset", resetPost);

router.get("/getChangePassword", getChangePassword);
router.post("/postChangePassword/:id", postChangePassword);

module.exports = router;

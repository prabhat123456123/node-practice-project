const express = require("express");
const router = express.Router();

const { getLogin,postLogin, getRegister,postRegister } = require("../../controller/frontend/user");

router.get("/login", getLogin);
router.post("/postLogin", postLogin);

router.get("/register", getRegister);
router.post("/postRegister", postRegister);




module.exports = router;

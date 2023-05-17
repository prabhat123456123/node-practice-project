const express = require("express");
const { check } = require('express-validator/check');
const router = express.Router();

const {
    error404,
    error500
 
} = require("../controller/error");

router.get("/404", error404);
router.get("/500", error500);

module.exports = router;

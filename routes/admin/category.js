const express = require("express");
const router = express.Router();

const {
  getCategory,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  postEditCategory,
  deleteCategory,
} = require("../../controller/admin/category");

router.get("/", getCategory);
router.get("/getAddCategory", getAddCategory);
router.post("/postAddCategory", postAddCategory);

router.get("/getEditCategory", getEditCategory);
router.post("/postEditCategory", postEditCategory);

router.get("/deleteCategory", deleteCategory);

module.exports = router;

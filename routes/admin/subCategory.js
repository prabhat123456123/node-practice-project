const express = require("express");
const router = express.Router();

const {
  getSubCategory,
  getAddSubCategory,
  postAddSubCategory,
  getEditSubCategory,
  postEditSubCategory,
  deleteSubCategory,
} = require("../../controller/admin/subCategory");

router.get("/", getSubCategory);
router.get("/getAddSubCategory", getAddSubCategory);
router.post("/postAddSubCategory", postAddSubCategory);

router.get("/getEditSubCategory", getEditSubCategory);
router.post("/postEditSubCategory", postEditSubCategory);

router.get("/deleteSubCategory", deleteSubCategory);

module.exports = router;

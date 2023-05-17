const express = require("express");
const router = express.Router();

const {
  getProduct,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../../controller/admin/product");

router.get("/", getProduct);
router.get("/getAddProduct", getAddProduct);
router.post("/postAddProduct", postAddProduct);

router.get("/getEditProduct", getEditProduct);
router.post("/postEditProduct", postEditProduct);

router.get("/deleteProduct", deleteProduct);

module.exports = router;

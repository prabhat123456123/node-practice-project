const express = require("express");
const router = express.Router();

const {
  getPage,
  getPageList,
  getAddPage,
  postAddPage,
  getEditPage,
  postEditPage,
  deletePage,
  reorderPage,
} = require("../../controller/admin/page");

router.post("/list", getPageList);
router.get("/", getPage);


router.get("/getAddPage", getAddPage);
router.post("/postAddPage", postAddPage);

router.get("/getEditPage/:id", getEditPage);
router.post("/postEditPage/:id", postEditPage);

router.get("/deletePage/:id", deletePage);

router.post("/reorderPage", reorderPage);

module.exports = router;

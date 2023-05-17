const express = require("express");
const router = express.Router();

const {
  getPost,getExcel,
  getAddPost,
  createPost,
  getEditPost,
  postEditPost,getPosts,
  excel,getPDF,
  deletePost,
} = require("../../controller/admin/post");

router.get("/", getPost);
router.post("/get-posts", getPosts);
router.get("/getAddPost", getAddPost);
router.post("/createPost", createPost);
router.post("/excel", excel);
router.get("/getExcel", getExcel);
router.get("/getPDF", getPDF);

router.get("/getEditPost/:id", getEditPost);
router.post("/postEditPost/:id", postEditPost);

router.get("/deletePost/:id", deletePost);

module.exports = router;

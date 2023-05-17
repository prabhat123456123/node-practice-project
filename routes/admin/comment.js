const express = require("express");
const router = express.Router();

const {
  getComment,
  approveComment,
  deleteComment,
} = require("../../controller/admin/comment");

router.get("/", getComment);
router.get("/approveComment", approveComment);
router.post("/deleteComment", deleteComment);

module.exports = router;

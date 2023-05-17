const express = require("express");
const router = express.Router();

const {
    event,
    addEvent,
  deleteComment,
} = require("../../controller/admin/calender");

router.get("/", event);

router.post("/addEvent", addEvent);

module.exports = router;

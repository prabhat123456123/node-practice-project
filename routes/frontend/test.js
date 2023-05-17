const express = require("express");
const router = express.Router();

const {
    singleTest,viewSolution,viewMarks,DeleteQuestion,prevQuestion,singleQuestion,saveQuestion

} = require("../../controller/frontend/test");

router.post("/Question", singleQuestion);
router.get("/singleTest", singleTest);

router.get("/viewSolution", viewSolution);
router.get("/viewMarks", viewMarks);
router.post("/saveQuestion", saveQuestion);
router.post("/prevQuestion", prevQuestion);
router.post("/DeleteQuestion", DeleteQuestion);

module.exports = router;

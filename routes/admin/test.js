const express = require("express");
const router = express.Router();

const {
    getSubject,getAddSubject,
    postAddSubject,
    getQuestion,
    getAddQuestion,
    postAddQuestion,
    getExam,getAddExam,
    postAddExam,
} = require("../../controller/admin/test");

router.get("/subject", getSubject);
router.get("/addSubject", getAddSubject);
router.post("/addSubject", postAddSubject);
router.get("/question", getQuestion);
router.get("/addQuestion", getAddQuestion);
router.post("/addQuestion", postAddQuestion);

router.get("/exam", getExam);
router.get("/addExam", getAddExam);
router.post("/addExam", postAddExam);

module.exports = router;

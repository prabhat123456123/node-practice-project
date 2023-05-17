const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userExamQuestionAnswerSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
       ref:"user"
    },
    exam:{
        type:Schema.Types.ObjectId,
       ref:"exam"
    },
    question:{
        type:Schema.Types.ObjectId,
       ref:"question"
    },
    userAnswer:{
        type:String,
        required:true
    },
    userMarks:{
        type:String,
       
    },
    
});
module.exports = mongoose.model("userExamQuestionAnswer",userExamQuestionAnswerSchema);
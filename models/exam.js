const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const onlineExamSchema = new Schema({
  
    examTitle:{
        type:String,
        required:true
    },
    slug:{
        type:String,
       
    },
    examDate:{
        type:Date,
       
       
    },
    examDuration:{
        type:String,
        required:true
    },
    totalQuestion:{
        type:String,
        require:true
    },
  
    created:{
        type:Date,
        default:Date.now()
    },
    examStatus:{
        type:String,
        default:"completed"
    },
    level:{
        type:String,
       
    },
     examCode:{
        type:String,
       
    },
   
});
module.exports = mongoose.model("onlineExam",onlineExamSchema);
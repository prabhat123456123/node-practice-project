const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionSchema = new Schema({
    exam:{
        type:Schema.Types.ObjectId,
       ref:"exam"
    },
    subject:{
        type:Schema.Types.ObjectId,
       ref:"exam"
    },
    questionTitle:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    option1:{
        type:String,
        required:true
       
    },
    option2:{
        type:String,
        required:true
       
    },
    option3:{
        type:String,
        required:true
       
    },
    option4:{
        type:String,
        required:true
       
    },
    option5:{
        type:String,
        required:true
       
    },
    rightOption:{
        type:String,
        required:true
       
    },
    rightMarks:{
        type:String,
        required:true
       
    },
    wrongMarks:{
        type:String,
        required:true
       
    },
    
    status:{
        type:String,
        default:"notSaved"
       
    },
   
});
module.exports = mongoose.model("question",questionSchema);
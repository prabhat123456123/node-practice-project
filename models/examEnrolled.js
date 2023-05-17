const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const examEnrolledSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
       ref:"user"
    },
    exam:{
        type:Schema.Types.ObjectId,
       ref:"exam"
    },
   
    status:{
        type:String,
        default:"enrolled"
    },
     
   
});
module.exports = mongoose.model("examEnrolled",examEnrolledSchema);
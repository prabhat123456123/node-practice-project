const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    body:{
        type:String,
        required:true
    },
    approve:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
       default:Date.now()
    },
   

});
module.exports=mongoose.model("comments",commentSchema)
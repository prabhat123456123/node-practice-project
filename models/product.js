const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
       ref:"user"
    },
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
       
    },
    desc:{
        type:String,
        required:true
    },
    allowComments:{
        type:Boolean,
        require:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        default:"public"
    },
     image:{
        type:String,
       
    },
    comment:[{
      
            type:Schema.Types.ObjectId,
           ref:"comment"
    

    }]
});
module.exports = mongoose.model("products",productSchema);
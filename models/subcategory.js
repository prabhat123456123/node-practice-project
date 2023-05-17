const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subCatSchema = mongoose.Schema({
    category:{
        type:Schema.Types.ObjectId,
       ref:"category"
    },
    title:{

        type:String,
        required:true
    },
    slug:{
        type:String,
       
    },
  
});

const subcategory = module.exports = mongoose.model('subcategory',subCatSchema)
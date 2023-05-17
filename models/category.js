const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const catSchema = mongoose.Schema({
   
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
       
    },
  
});

const category = module.exports = mongoose.model('category',catSchema)
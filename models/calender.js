const mongoose = require('mongoose');
const calenderSchema = mongoose.Schema({
    title:{
        type:String,
        
    },
    startDate:{
        type:String,
       
    },
    endDate:{
        type:String,
       
    },
  
});

const calender = module.exports = mongoose.model('calender',calenderSchema)
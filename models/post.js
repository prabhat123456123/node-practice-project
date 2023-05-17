const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = mongoose.Schema({
  user:{
    type:Schema.Types.ObjectId,
   ref:"user"
},
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },

  image: {
    type: String,
   
  },
  comment:[{
      
    type:Schema.Types.ObjectId,
   ref:"comment"


}]
});

const post = (module.exports = mongoose.model("post", postSchema));

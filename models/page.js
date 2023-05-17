const mongoose = require("mongoose");
const pageSchema = mongoose.Schema({
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
  sorting: {
    type: Number,
  },
  image: {
    type: String,
   
  },
});

const page = (module.exports = mongoose.model("page", pageSchema));

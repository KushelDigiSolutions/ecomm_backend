const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  price: {
    type: Number,
    required:true ,
  },


  thumbnail:[
    {
      type:String, 
    }
],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const productSchema = mongoose.model("Product", productModel);
module.exports = productSchema;

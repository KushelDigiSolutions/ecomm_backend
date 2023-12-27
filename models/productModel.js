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
   cart:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }] , 
   wishlist:[
    {
      type: mongoose.Schema.Types.ObjectId , 
      ref:"User"
    }
   ],
   category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
},

});



const productSchema = mongoose.model("Product", productModel);
module.exports = productSchema;

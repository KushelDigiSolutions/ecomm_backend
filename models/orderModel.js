
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    
     userId:{
        type: mongoose.Schema.Types.ObjectId , 
        ref:"User"
     },
     products:[{
        type: mongoose.Schema.Types.ObjectId , 
        ref:"Product"
     }] ,
     totalAmount:{
        type: Number , 

     } ,
     shippingAddress:{
        type: String ,

     }, 
     orderStatus:{
        type: String , 
        default:"Pending"
     }
   
} , {timestamps:true})

module.exports = mongoose.model("Order",orderSchema);
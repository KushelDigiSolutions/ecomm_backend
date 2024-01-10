const User = require("../models/userModel");
const Order = require("../models/orderModel")
const { ObjectId } = require('mongodb');


exports.fetchOrderHistory = async(req ,res)=>{
    try{
        const userId = req.user.id;

        const userObj = new ObjectId(userId);

        const orderHistory = await Order.find({userId:userObj}).populate("products");

        if(!orderHistory.length){
            return res.status(403).json({
                success:false ,
                message:"No order history found"
            })
        }

         return res.status(200).json({
            success:true ,
            message:"Successfuly found the order histroy",
            orderHistory
         })
          

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false ,
            message:"Internal server error"
        })
    }
}
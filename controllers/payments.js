const instance = require("../config/razorpay");
const User = require("../models/userModel");
// const mongoose = require("mongoose");
const Product = require("../models/productModel")
const crypto = require('crypto');


// ! for multiple item payment at a time
exports.capturePayment = async (req, res) => {


  const { products } = req.body;
  
  const userId = req.user.id;


  if (products?.length === 0) {
    return res.json({ success: false, message: "please provide products Id" });
  }

  let totalAmount = 0;

  for (const product_id of products) {
    let product;
    try {
      product = await Product.findById(product_id);
      if (!product) {
        return res
          .status(200)
          .json({ success: false, message: "could not find the product" });
      }

      // const uid = new mongoose.Types.ObjectId(userId);
      

      totalAmount += product.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);

    console.log("paymentRess" , paymentResponse);

    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

// ! for multiple item buy
exports.verifyPayment = async (req, res) => {
  
  const razorpay_order_id = req.body.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;


  // const products = req.body?.products;

  // const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature 
    // ||
    // ! products ||
    // !userId
  ) {
    return res.status(200).json({ success: false, message: "payment failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

  if (expectedSignature === razorpay_signature) {
  
    //  return res
    return res.status(200).json({
      success: true,
      message: " payment verified",
    });
  }

  return res.status(200).json({
    success: false,
    message: "paymenrt failed",
  });
};




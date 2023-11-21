const mongoose = require("mongoose");

const userModel =new mongoose.Schema({
  name:String,
  email:String,
  description:String,
  role:String,
  password:String,
  // ts:new Date().now
});

const userSchema = mongoose.model("User",userModel);
module.exports = userSchema;
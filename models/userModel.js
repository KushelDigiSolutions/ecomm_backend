const mongoose = require("mongoose");
const userModel = mongoose.Schema({
  name:String,
  email:String,
  description:String,
  role:String,
  ts:new Date().now
});

const userSchema = mongoose.model("User",userModel);
module.exports = userSchema;
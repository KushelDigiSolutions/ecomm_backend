const mongoose = require("mongoose");

const userModel =new mongoose.Schema({
firstName:{
  type:String ,
},
lastName:{
  type:String ,
}
,
email:{
  type:String,
},
phoneNumber:{
  type:Number,
},
password:{
  type:String,
  trim:true
},
role:{
  type:String ,
  anum:["Admin","User"],
  default:"User"
}

});

const userSchema = mongoose.model("User",userModel);
module.exports = userSchema;
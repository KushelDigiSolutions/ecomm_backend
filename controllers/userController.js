const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const mailSender = require("../utils/mailSender");

// getUser
exports.getUserDetails = async(req , res)=>{
    try{

        const id = req.user.id;

        const userDetails = await User.findById({_id:id});

        if(!userDetails){
            return res.status(404).json({
                success:false , 
                message:"user does not found "
            })
        }

        return res.status(200).json({
            success:true , 
            message:"user details fetch successfully",
            data:userDetails
        })



    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false ,
            message:"error in getUserDetails"
        })
    }
}

// postUser
exports.signUp = async(req , res)=>{
    try{

        const { firstName,
        lastName,
        phoneNumber,
        email,
        password,
        role
        } = req.body;

        if(!firstName || !email || !lastName || !phoneNumber || !password){

            return res.status(403).json({
                success:false , 
                message:"all fields are required",
            })
        }

        const existUser = await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                success: false , 
                message:"User is aleady register",
            });
        }

          const hashPassword = await bcrypt.hash(password ,10);

          const userDetails = await User.create({
            firstName,
            lastName,
            phoneNumber,
            role,
            email , password:hashPassword
        }) 

        return res.status(200).json({
            success:true , 
            message:"user is register succesfully",
            userDetails 
        })
     
     

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false , 
            message:"successfuly signUp",
        })
    }
}

// admin login
exports.adminLogin = async (req, res) => {
    try {
      //  get data from req.body
      const { email, password } = req.body;


  
      //  validation data
      if (!email || !password) {
        return res.status(403).json({
          success: false,
          message: `all fields are required ,please try again`,
        });
      }
      // user check exist of not
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `please register as Admin before login`,
        });
      }

      if(user.role !== "Admin"){
 return res.status(404).json({
  success: false , 
  message:"Admin do not found with this email id "
 })
      }
  
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
  
      // password match and generate jwt
      if (await bcrypt.compare(password, user.password)) {

        //  creating token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });
  
        // todo: toObject ki jrurt ho skti hai fat skta hai
        user.token = token;
        user.password = undefined;
  
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
  
        // create cookie and send response
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `login successfully`,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: `password inccorrect`,
        });
      }
    } catch (error) {
      console.log(`error in login `, error);
      return res.status().json({
        success: false,
        message: ` login failure , please try again `,
      });
    }
  };
// login
exports.login = async (req, res) => {
    try {
      //  get data from req.body
      const { email, password } = req.body;
  
      //  validation data
      if (!email || !password) {
        return res.status(403).json({
          success: false,
          message: `all fields are required ,please try again`,
        });
      }
      // user check exist of not
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `please register before login`,
        });
      }
  
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
  
      // password match and generate jwt
      if (await bcrypt.compare(password, user.password)) {

        //  creating token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });
  
        // todo: toObject ki jrurt ho skti hai fat skta hai
        user.token = token;
        user.password = undefined;
  
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
  
        // create cookie and send response
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `login successfully`,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: `password inccorrect`,
        });
      }
    } catch (error) {
      console.log(`error in login `, error);
      return res.status().json({
        success: false,
        message: ` login failure , please try again `,
      });
    }
  };

// updateUser
exports.updateUser = async( req , res)=>{
    try{

        const {name , description } = req.body;


        const id = req.user.id;
        console.log('id' , id);

        const userDetails = await User.findById({_id:id});
           console.log('userDetails' , userDetails);

 if(name){
     userDetails.name = name;

 }

    if(description){
        userDetails.description = description;
    }

    await userDetails.save();

    return res.status(200).json({
        success:true , 
        message:"User Profile Updated successfully",
       data:userDetails , 
    })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false , 
            message:"cannot update user"
        })
    }
}


// deleteUser
exports.deleteUser = async(req ,res)=>{

    try{
        // fetch id 
         const id = req.user.id;

        const userDetails = await User.findOne({_id:id});

        if(!userDetails){
            return res.status(404).json({
                success:false , 
                message:"User Not Found",
            })
        }

        // delete profile 
        await User.findByIdAndDelete({
            _id : id
        }).exec();

        return res.status(200).json({
            success:true , 
            message:"user account deleted successfully",
        })

    }

   
catch(error){
console.log(error);
return res.status(500).json({
    success:false , 
    message:"cannot delete account , please try again",
})
    }
}


// get all users 
exports.getAllUsers = async(req , res)=>{
  try{

    const allUsers =await User.find({});

    if(allUsers.length === 0){
      return res.status(403).json({
        success:false ,
        message:"no user found till now"
      })
    }

    return res.status(200).json({
      success:true , 
      message:"successfuly fetch all users ",
      data: allUsers
    })
    

  } catch(error){
    console.log(error);
    return res.status(500).json({
      success:false ,
      message:"error in fetch all useres "
    })
  }
}

// update address
exports.updateAddress = async(req , res)=>{
  try{
 
    const {country , pincode , address , city} = req.body;
  
    if(!country || !pincode || !address || !city){
      return res.status(403).json({
        success:false ,
        message:"please send all data of address"
      })
    }
    const id = req.user.id;

    const updatedAddress = {
      country , 
      pincode , 
      addressLine:address ,
       city
    }

    const userDetails = await User.findById({_id:id});
     if(userDetails){
      userDetails.address = updatedAddress;

await userDetails.save();
return res.status(200).json({
  success:true ,
  messsage:"successfully save the address" , 
  userDetails
 })

}
else{
  return res.status(404).json({
    success:false ,
    message:"User not found"
  })
}


  } catch(error){
    console.log(error);
    return res.status(500).json({
      success:false , 
      message:"internal server error"
    })
  }
} 


// send connect mail
exports.sendConnectMail = async(req ,res)=>{
  try{

    const {email} = req.body;

    if(!email){
      return res.status(403).json({
        success:false ,
        message:"Please send the email id"
      })
    }

    await mailSender(email , `You are connected with us` 
    ,
    ` hey !! `);

    return res.status(200).json({
      success:true,
      message:"emai sent successfully "
  })


  } catch(error){
    console.log(error);
    return res.status(500).json({
      success:false , 
      message:"Intenal server error "
    })
  }
}

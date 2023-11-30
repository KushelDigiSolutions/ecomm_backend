const Product = require('../models/productModel');
const { uploadToCloudinary } = require("../utils/imageUploader");


// create product 

exports.createProduct = async(req , res)=>{
    try{

        const {title , description , price } = req.body;
        
        const thumbnail = req.files.thumbnail;
        
        console.log('req' , thumbnail);
        
        const userId = req.user.id;
        
        if(!title || !description || !price || !thumbnail){
            return res.status(403).json({
                success:false , 
                message:"all fields are required"
            })
        }

         // upload to cloudinary
    const image = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      console.log('image' , image);

        const product = await Product.create({title , description , price , thumbnail: image.secure_url  , postedBy:userId});

        return res.status(200).json({
            success:true , 
            message:"successfuly created the product ",
            product
        })

    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false , 
            message:"internal server error in creating product"
        })
    }
}

// update product 

exports.updateProduct = async(req , res)=>{
    try{

         const {title , description , price , thumbnail } = req.body;

         const {productId} = req.params;

         if(!productId){
             return res.status(403).json({
                 success:false , 
                 message:"please send the product ID"
                })
            }
            
            //   check product id exist or not
          const productDetails = await Product.findById({_id:productId});

          if(!productDetails){
            return res.status(404).json({
                success:false , 
                message:"product do not exist with this product ID"
            })
          }


        //   product ID is valid 
        if(title){
            productDetails.title = title
        }

        if(description){
            productDetails.description = description;
        }

        if(price){
            productDetails.price = price;
        }

        if(thumbnail){
            productDetails.thumbnail = thumbnail;
        }

       await productDetails.save();

       return res.status(200).json({
        success:true , 
        message:"Product details update successfully"
       })

    } catch(error){
   console.log(error);
        res.status(500).json({
            success:false , 
            message:"internal server error in updating product"
        })
    }
}

// delete product 
exports.deleteProduct = async(req , res)=>{
    try{

        const {productID} = req.params;

        if(!productID){
            return res.status(403).json({
                success:false , 
                message:"please send product ID"
            })
        }

        // chekc valid or not 
        const productDetails = await Product.findByIdAndDelete({_id:productID});

  return res.status(200).json({
    success:true , 
    message:"product deleted successfully " , 
    productDetails
  })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false , 
            message:"Delete product unsuccessfull , please try againb"
        })
    }
}

// fetch all products 
exports.fetchAllProducts = async(req , res)=>{
    try{

        const allProducts = await Product.find({});

        return res.status(200).json({
            success:true , 
            message:"successfuly all products",
            allProducts
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false , 
            message:"internal server error in fetch all products "
        })
    }
}

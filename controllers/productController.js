const Product = require('../models/productModel');
const { uploadToCloudinary } = require("../utils/imageUploader");
const Category  = require("../models/productCategory")


// create product 

exports.createProduct = async(req , res)=>{
    try{

        const {title , description , price ,category} = req.body;
        
        const thumbnail = req.files.thumbnail;
        
        
        const userId = req.user.id;
        
        if(!title || !description || !price || !thumbnail ||!category){
            return res.status(403).json({
                success:false , 
                message:"all fields are required"
            })
        }

          //   see the category is valid or not
    const categoryDetails = await Category.findOne({_id:category});

    if(!categoryDetails){
        return res.status(404).json({
            success:false,
            message:"category details not found ",
        })
       }

         // upload to cloudinary
    const image = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );


  

        const product = await Product.create({title , description , price , thumbnail: image.secure_url  , postedBy:userId , category:categoryDetails._id});

         // add course entry in Category => because us Category ke inside sare course aa jaye
         await Category.findByIdAndUpdate({_id:categoryDetails._id} , {
            $push:{
                products:product._id,
            }
        },{new:true})
        

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

        console.log("productId" ,productID);

        if(!productID){
            return res.status(403).json({
                success:false , 
                message:"please send product ID"
            })
        }


        // delete the product from the category
        const categoryDetail = await Product.findById({_id:productID});

        console.log('categorde' , categoryDetail);

        // REMOVE THE ITEM FROM CATEGORY 
        const categoryId = categoryDetail._id;

        console.log('categoryId' , categoryId);

        const details =  await Category.findByIdAndUpdate(
            { _id: categoryId },
             {$pull: { products: productID } }
        );


        // chekc valid or not 
        const productDetails = await Product.findByIdAndDelete({_id:productID});

   

        console.log('deta' ,details);


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

        const allProducts = await Product.find({}).populate("category");

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

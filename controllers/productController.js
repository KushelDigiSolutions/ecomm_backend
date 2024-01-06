const Product = require('../models/productModel');
const { uploadToCloudinary } = require("../utils/imageUploader");
const SubCategory  = require("../models/productSubCategory")


// create product 

exports.createProduct = async(req , res)=>{
    try{

        const {title , description , price ,subCategoryId} = req.body;
        
        const thumbnail = req.files.thumbnail;
        
        
        const userId = req.user.id;
        
        if(!title || !description || !price || !thumbnail ||!subCategoryId){
            return res.status(403).json({
                success:false , 
                message:"all fields are required"
            })
        }

          //   see the category is valid or not
    const subCategoryDetails = await SubCategory.findOne({_id:subCategoryId});

    if(!subCategoryDetails){
        return res.status(404).json({
            success:false,
            message:"sub category details not found ",
        })
       }

         // upload to cloudinary
    const image = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

        const product = await Product.create({title , description , price , thumbnail: image.secure_url  , postedBy:userId , subCategory:subCategoryDetails._id});

         // add course entry in Category => because us Category ke inside sare course aa jaye
         await SubCategory.findByIdAndUpdate({_id:subCategoryDetails._id} , {
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

         const {title , description , price  } = req.body;

         const thumbnail = req.files?.thumbnail;


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

                  // upload to cloudinary
    const image = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

            productDetails.thumbnail = image.secure_url;
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


        // delete the product from the sub Category
        const productDetails = await Product.findById({_id:productID});


        // REMOVE THE ITEM FROM CATEGORY 
        const subCategoryId = productDetails.subCategory;


         await SubCategory.findByIdAndUpdate(
            { _id: subCategoryId },
             {$pull: { products: productID } }
        );


        // delete the product  
         await Product.findByIdAndDelete({_id:productID});



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

        const allProducts = await Product.find({}).populate("subCategory");

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

// get product by id
exports.getProductById = async(req , res)=>{
    try{

        const {productId} = req.params;

        if(!productId){
            return res.status(403).json({
                success:false , 
                message:"please send the product Id "
            })
        }

         const productDetails = await Product.findOne({_id:productId});

         if(!productDetails){
            return res.status(404).json({
                success:false , 
                message:"no product found with this id "
            })
         }

         return res.status(200).json({
            success:true , 
            message:"successfuly fetch the product Details", 
            data:productDetails
         })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false , 
            message:"internal server error in get product by id"
        })
    }
}

exports.totalProduct = async(req ,res)=>{
    try{

         const AllProduct = await Product.find({});

         return res.status(200).json({
            success:true ,
            AllProduct
         })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false , 
            message:"Internal server error "
        })
    }
}
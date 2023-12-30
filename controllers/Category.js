const Category = require("../models/productCategory");
const Product = require("../models/productModel");
const { ObjectId } = require('mongodb');

const { uploadToCloudinary } = require("../utils/imageUploader");


// ! createCategory
exports.createCategory = async (req, res) => {
  try {
    // fetch the data
    const {title} = req.body;

        
    const thumbnail = req.files.thumbnail;

    
    // validation
    if (!title || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const image = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );


    // create entry in db
    const categoryDetails = await Category.create({ title ,images: image.secure_url});



    // return
    return res.status(200).json({
      success: true,
      message: "category created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! get all category
exports.showAllCategory = async (req, res) => {
  try {

    const allCategory = await Category.find({}, { title: true , images:true });

    res.status(200).json({
      success: true,
      message: "all category return succesfully",
     data:allCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! category page details -> see ui different different types ke course show krna 
exports.categoryPageDetails = async(req,res)=>{
  try{

    // get category id
    const {categoryId} = req.params;

    // get courses for specified category id
    const selectedCategory = await Category.findById(categoryId).populate({
      path:"products",
    }).exec(); 

     console.log("seletedCategory" , selectedCategory);
     

    // validation 
    if(!selectedCategory){
      return res.status(404).json({
        success:false,
        message:"categoy not found "
      })
    }

    if(selectedCategory.products.length === 0){
      return res.json({
        success:false,
        message:"no product found for the selected category",
      })
    }
   

    // ṛeturn 
    return res.status(200).json({
      success:true,
      message:"successfuly fetch all category details ",
    data:{
      selectedCategory,
    
    }
    })
         
  } catch(error){
 console.log(error);
 return res.status(500).json({
  success:false,
  message:error.message
 })
  }
}

// ! delete category 
exports.deleteCategory = async(req , res)=>{
  try{

    const {categoryId} = req.params;

    console.log("categoryiD" ,categoryId);

     const categoryDetail = await Category.findOne({_id:categoryId});

     console.log("categoryDe" , categoryDetail);

     if(!categoryDetail){
      return res.status(404).json({
        success:false ,
        message:"category do not found with this ID"
      })
     }

   for (let index = 0; index < categoryDetail.products.length; index++) {
    const productId = categoryDetail.products[index];

    const productIdObjectId = new ObjectId(productId);


     await Product.findByIdAndDelete({_id:productIdObjectId} , {new:true});
    
   }

     await Category.findByIdAndDelete({_id:categoryId} , {new:true});

     return res.status(200).json({
      success:true  ,
      message:"Category deleted successfuly"
     })

  } catch(error){
     console.log(error);
     return res.status(500).json({
      success:false , 
      message:"internal server error , delete category"
     })
  }
}

// ! update category 
exports.updateCategory = async(req , res)=>{
  try{

    const {categoryId} = req.params;

    const {title } = req.body;

    const thumbnail = req.files.thumbnail;


    if(!categoryId){
      return res.status(403).json({
        success:false , 
        message:"please send the cattegory Id"
      })
    }

    if(!title && !thumbnail){
      return res.status(403).json({
        success:false , 
        message:"no new update is done "
      })
    }

    const categoryDetails = await Category.findOne({_id:categoryId});

    if(!categoryDetails){
      return res.status(404).json({
        success:false , 
        message:"no category found with this Id"
      })
    }


     if(title){
      categoryDetails.title = title;
     }
     if(thumbnail){
      const imageDetail = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      categoryDetails.images = imageDetail.secure_url;

     }

     await categoryDetails.save();

     return res.status(200).json({
      success:true , 
      message:"successfuly updated the category"
     })


  } catch(error){
    console.log(error);
    return res.status(500).json({
      success:false , 
      message:"update category intenal server error"
    })
  }
}
const Category = require("../models/productCategory");
const { uploadToCloudinary } = require("../utils/imageUploader");


// ! createCategory
exports.createCategory = async (req, res) => {
  try {
    // fetch the data
    const {title} = req.body;

    console.log("title" ,title);
        
    const thumbnail = req.files.thumbnail;

    console.log("thubnail" , thumbnail);
    
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

      console.log("imagea" ,image);

    // create entry in db
    const categoryDetails = await Category.create({ title ,images: image.secure_url});
    console.log(`categoryDetails `, categoryDetails);

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

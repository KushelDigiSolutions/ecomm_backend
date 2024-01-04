// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const { createProduct , updateProduct , deleteProduct , fetchAllProducts, getProductById } = require("../controllers/productController");


const { auth , isAdmin } = require("../middleware/auth");
const { createCategory , showAllCategory , deleteCategory, updateCategory } = require("../controllers/Category");
const { createSubCategory , fetchAllSubCategoryOfCategory , subCategoryPageDetails, deleteSubCategory , updateSubCategory } = require("../controllers/SubCategory");


// ********************************************************************************************************
//                                      product routes
// ********************************************************************************************************

router.post("/createProduct",auth , isAdmin ,  createProduct)

router.put("/updateProduct/:productId",auth , isAdmin ,  updateProduct)

router.delete('/deleteProduct/:productID' ,auth ,isAdmin ,  deleteProduct);

router.get("/getProductById/:productId" , getProductById);

router.get('/fetchAllProducts' , fetchAllProducts);


// ********************************************************************************************************
//                                      product routes by using category 
// ********************************************************************************************************

router.post("/createCategory" , auth , isAdmin , createCategory);

router.delete("/deleteCategory/:categoryId" , auth , isAdmin , deleteCategory);

router.get("/showAllCategory"  , showAllCategory);

router.put("/updateCategory/:categoryId" , auth , isAdmin , updateCategory);



// ********************************************************************************************************
//                                      product routes by using sub category 
// ********************************************************************************************************

router.post("/createSubCategory" , auth , isAdmin , createSubCategory);

router.get("/fetchAllSubCategoryOfCategory/:categoryId"  , fetchAllSubCategoryOfCategory);

router.get("/subCategoryPageDetails/:subCategoryId"  , subCategoryPageDetails);

router.delete("/deleteSubCategory/:subCategoryId"  , deleteSubCategory);

router.put("/updateSubCategory/:subCategoryId"  , updateSubCategory);






module.exports = router;
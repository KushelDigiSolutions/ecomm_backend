// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const { createProduct , updateProduct , deleteProduct , fetchAllProducts, getProductById, totalProduct } = require("../controllers/productController");


const { auth , isAdmin, isUser } = require("../middleware/auth");
const { createCategory , showAllCategory , deleteCategory, updateCategory, fetchCategoryPageDetail, getProductsByCategoryId } = require("../controllers/Category");
const { createSubCategory , fetchAllSubCategoryOfCategory , subCategoryPageDetails, deleteSubCategory , updateSubCategory } = require("../controllers/SubCategory");
const { fetchOrderHistory } = require("../controllers/OrderController");


// ********************************************************************************************************
//                                      product routes
// ********************************************************************************************************

router.post("/createProduct",auth , isAdmin ,  createProduct)

router.put("/updateProduct/:productId",auth , isAdmin ,  updateProduct)

router.get("/totalProduct" , totalProduct);

router.delete('/deleteProduct/:productID' ,auth ,isAdmin ,  deleteProduct);

router.get("/getProductById/:productId" , getProductById);

router.get('/fetchAllProducts' , fetchAllProducts);


// ********************************************************************************************************
//                                      product routes by using category 
// ********************************************************************************************************

router.post("/createCategory" , auth , isAdmin , createCategory);

router.delete("/deleteCategory/:categoryId" , auth , isAdmin , deleteCategory);

router.get("/showAllCategory"  , showAllCategory);
router.get("/categoryPageDetails/:categoryId"  , fetchCategoryPageDetail);


router.put("/updateCategory/:categoryId" , auth , isAdmin , updateCategory);

router.get("/getProductsByCategoryId/:categoryId" , getProductsByCategoryId)

// ********************************************************************************************************
//                                      product routes by using sub category 
// ********************************************************************************************************

router.post("/createSubCategory" , auth , isAdmin , createSubCategory);

router.get("/fetchAllSubCategoryOfCategory/:categoryId"  , fetchAllSubCategoryOfCategory);

router.get("/subCategoryPageDetails/:subCategoryId"  , subCategoryPageDetails);

router.delete("/deleteSubCategory/:subCategoryId"  , deleteSubCategory);

router.put("/updateSubCategory/:subCategoryId"  , updateSubCategory);

// ********************************************************************************************************
//                                      order routes  
// ********************************************************************************************************

router.get("/getOrderHistory" , auth , isUser , fetchOrderHistory);


module.exports = router;
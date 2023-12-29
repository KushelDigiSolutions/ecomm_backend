// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const {
createProduct , updateProduct , deleteProduct , fetchAllProducts, getProductById
} = require("../controllers/productController");


const { auth , isAdmin } = require("../middleware/auth");
const { createCategory , showAllCategory , categoryPageDetails, deleteCategory, updateCategory } = require("../controllers/Category");


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

router.get("/categoryPageDetails/:categoryId"  , categoryPageDetails);

module.exports = router;
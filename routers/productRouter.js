// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const {
createProduct , updateProduct , deleteProduct , fetchAllProducts
} = require("../controllers/productController");


const { auth , isAdmin } = require("../middleware/auth");
const { createCategory , showAllCategory , categoryPageDetails } = require("../controllers/Category");


// ********************************************************************************************************
//                                      product routes
// ********************************************************************************************************

router.post("/createProduct",auth , isAdmin ,  createProduct)

router.put("/updateProduct/:productId",auth , isAdmin ,  updateProduct)

router.delete('/deleteProduct/:productID' ,auth ,isAdmin ,  deleteProduct);

router.get('/fetchAllProducts' , fetchAllProducts);


// ********************************************************************************************************
//                                      product routes by using category 
// ********************************************************************************************************

router.post("/createCategory" , auth , isAdmin , createCategory);
router.get("/showAllCategory"  , showAllCategory);
router.get("/categoryPageDetails/:categoryId"  , categoryPageDetails);

module.exports = router;
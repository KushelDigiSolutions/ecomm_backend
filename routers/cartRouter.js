// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const {
fetchAllCartItem , addToCart , removeFromCart
} = require("../controllers/cartController");


const { auth  , isUser } = require("../middleware/auth")


// ********************************************************************************************************
//                                      cart routes
// ********************************************************************************************************

router.get("/fetchAllCartItems",auth , isUser ,  fetchAllCartItem)

router.post("/addToCart/:productId",auth , isUser ,  addToCart)

router.post('/removeFromCart/:productId' ,auth , isUser ,  removeFromCart);

module.exports = router;
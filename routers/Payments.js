// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, fetchAllPayments } = require("../controllers/payments")

const {auth , isUser, isAuth, isAdmin} = require("../middleware/auth")
router.post("/capturePayment", auth, isUser, capturePayment)
router.post("/verifySignature/:token"  ,isAuth ,isUser , verifyPayment);

router.get("/fetchAllPayments" ,auth , isAdmin , fetchAllPayments)

module.exports = router;
// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment } = require("../controllers/payments")

const {auth , isUser} = require("../middleware/auth")
router.post("/capturePayment", auth, isUser, capturePayment)
router.post("/verifySignature" , verifyPayment)

module.exports = router;
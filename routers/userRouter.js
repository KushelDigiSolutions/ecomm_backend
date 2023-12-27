// Import the required modules
const express = require("express")
const router = express.Router();

// Import the required controllers and middleware functions
const {
login , signUp , updateUser , getUserDetails , deleteUser, adminLogin, getAllUsers
} = require("../controllers/userController");


const { auth, isAdmin } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

router.post("/adminLogin", adminLogin)

// Route for user signup
router.post("/signup", signUp)

router.get("/getAllUsers" , auth , isAdmin , getAllUsers);

router.put('/updateDetails' ,auth ,  updateUser);

router.delete('/deleteUser' ,auth , deleteUser);

router.get("/getUserDetail" ,auth, getUserDetails);


module.exports = router;
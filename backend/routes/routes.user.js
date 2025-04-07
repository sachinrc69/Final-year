const express = require("express");
const router = express.Router();
const {
  // SaveUser,
  registerUser,
  loginUser,
  userVerification,
  verifyOTP,
} = require("../controllers/controllers.user");



// Save a new user
// router.post("/", SaveUser);

//user verification
router.post("/send_otp", userVerification)

// Register a new user
router.post("/sign_up", registerUser);

// User login route
router.post("/login", loginUser);

router.post("/verifyOTP", verifyOTP);

module.exports = router;

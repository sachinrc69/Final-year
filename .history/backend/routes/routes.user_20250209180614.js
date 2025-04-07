const express = require("express");
const router = express.Router();
const {
  getUserByAadhar,
  getUserMailByAadhar,
  SaveUser,
  registerUser,
  loginUser,
} = require("../controllers/controllers.user");

// Get user by Aadhar ID
router.get("/:aadharid", getUserByAadhar);

// Get user email by Aadhar ID
router.get("/mail/:aadharid", getUserMailByAadhar);

// Save a new user
router.post("/", SaveUser);

// Register a new user
router.post("/user_register", registerUser);

// User login route
router.post("/user_login", loginUser);

module.exports = router;

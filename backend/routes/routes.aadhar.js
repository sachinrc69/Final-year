const express = require("express");
const router = express.Router();
const {
    getUserByAadhar,getUserMailByAadhar,addUser
} = require("../controllers/controllers.aadhar");

// Get user by Aadhar ID
router.get("/:aadharid", getUserByAadhar);

// Get user email by Aadhar ID
router.get("/mail/:aadharid", getUserMailByAadhar);

// add user to aadhar DB
router.post("/",addUser)

module.exports = router;

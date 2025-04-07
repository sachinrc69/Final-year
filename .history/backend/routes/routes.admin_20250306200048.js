const express = require("express");
const {
  loginAdmin,
  storeElection,
  getAllElections,
} = require("../controllers/controllers.admin"); // Ensure correct import
const router = express.Router();
//console.log(loginAdmin);
console.log(storeElection);
router.post("/login", loginAdmin);
router.post("/storeElection", storeElection);
module.exports = router;

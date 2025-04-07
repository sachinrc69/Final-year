const express = require("express");
const {
  loginAdmin,
  storeElectionResults,
} = require("../controllers/controllers.admin"); // Ensure correct import
const router = express.Router();
//console.log(loginAdmin);

router.post("/login", loginAdmin);
router.post("/admin/storeElection", storeElection);
module.exports = router;

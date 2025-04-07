const express = require("express");
const { loginAdmin } = require("../controllers/controllers.admin"); // Ensure correct import
const router = express.Router();
//console.log(loginAdmin);

router.post("/login", loginAdmin);
router.post("/admin/storeElection", storeElectionResults);
module.exports = router;

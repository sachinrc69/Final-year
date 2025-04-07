const express = require("express");
const { loginAdmin } = require("../controllers/controllers.admin"); // Ensure correct import
const router = express.Router();
//console.log(loginAdmin);

router.post("/admin_login", loginAdmin);

module.exports = router;

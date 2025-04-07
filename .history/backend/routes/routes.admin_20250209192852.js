const express = require("express");
const { loginAdmin } = require("../controllers/controllers.admin"); // Ensure correct import
const router = express.Router();

router.post("/admin_login", loginAdmin); // ✅ Correct route definition

module.exports = router;

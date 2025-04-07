const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/controllers.user");

router.post("/admin_login", loginAdmin);

module.exports = router;

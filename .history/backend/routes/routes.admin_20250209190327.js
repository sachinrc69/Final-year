const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/controllers.user");

router.post("/admin_login", loginUser);

module.exports = router;

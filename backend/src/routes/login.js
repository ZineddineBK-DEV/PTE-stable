const express = require("express");
const router = express.Router();
const userCtr = require("../controllers/userController");
const { loginValidation } = require("../config/validation");

router.post("", loginValidation, userCtr.login);

module.exports = router;

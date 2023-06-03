const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/auth.contriller");

router.post("/signup", signup);

module.exports = router;

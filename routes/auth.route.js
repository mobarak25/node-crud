const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checklogin");
const {
  signup,
  login,
  changePassword,
} = require("../controllers/auth.contriller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/changepassword", checkLogin, changePassword);

module.exports = router;

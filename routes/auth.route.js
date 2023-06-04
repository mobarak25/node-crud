const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/checklogin");
const {
  signup,
  login,
  changePassword,
  sendUserPasswordResetEmail,
  resetPassword,
} = require("../controllers/auth.contriller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/changepassword", checkLogin, changePassword);
router.post("/email-for-reset-password", sendUserPasswordResetEmail);
router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;

const express = require("express");
const checkLogin = require("../middlewares/checklogin");
const router = express.Router();
const {
  getAllUsers,
  getOneUser,
  createUser,
  UpdateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.post("/get", checkLogin, getAllUsers);
router.post("/get-one", getOneUser);
router.post("/create", createUser);
router.post("/update-user", UpdateUser);
router.post("/delete-one", deleteUser);

module.exports = router;

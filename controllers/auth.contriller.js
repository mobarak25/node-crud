const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authUser = require("../models/auth.model");
const config = require("../config/config");

//signup user
const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new authUser({
      id: uuidv4(),
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//login user
const login = async (req, res) => {
  try {
    const findAuthUser = await authUser.find({
      username: req.body.username,
    });
    if (findAuthUser && findAuthUser.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        findAuthUser[0].password
      );
      if (isValidPassword) {
        // Genarate token
        const token = jwt.sign(
          { username: findAuthUser[0].username, email: findAuthUser[0].email },
          config.app.token_sectet,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          acess_token: token,
          message: "User login sucessfylly",
        });
      } else {
        res.status(401).json({ message: "Aunthecation failed" });
      }
    } else {
      res.status(401).json({ message: "Aunthecation failed" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// change password
const changePassword = async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  const hashedPassword = await bcrypt.hash(new_password, 10);

  if (current_password && new_password && confirm_password) {
    const findAuthUser = await authUser.findOne({
      username: req.username,
    });

    const isValidPassword = await bcrypt.compare(
      current_password,
      findAuthUser.password
    );
    if (isValidPassword) {
      if (new_password === confirm_password) {
        findAuthUser.password = hashedPassword;
        await findAuthUser.save();

        res.status(200).json({
          message: "Change password sucessfylly",
        });
      } else {
        res.status(401).json({
          message: "new Password and confirm password not match",
        });
      }
    } else {
      res.status(401).json({
        message: "Invalid current password",
      });
    }
  } else {
    res.status(401).json({ message: "All field are required" });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
};

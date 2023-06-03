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

module.exports = {
  signup,
  login,
  // createUser,
  // UpdateUser,
  // deleteUser,
};

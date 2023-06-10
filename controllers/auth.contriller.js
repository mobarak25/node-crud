const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const authUser = require("../models/auth.model");
const config = require("../config/config");
const transporter = require("../config/email.comfig");

//signup user
const signup = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await authUser.findOne({ email: email });

    if (exists == null) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new authUser({
        id: uuidv4(),
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).send({
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      });
    } else {
      res.status(401).send({ message: "Email already exists" });
    }
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

  if (current_password && new_password && confirm_password) {
    const findAuthUser = await authUser.findOne({
      username: req.username,
    });
    const hashedPassword = await bcrypt.hash(new_password, 10);

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

const sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await authUser.findOne({ email: email });
    if (user) {
      const secret = user.id + config.app.token_sectet;

      // Genarate token
      const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn: "15m",
      });
      //Genarate link
      const link = `http://localhost:4000/api/users/reset/${user.id}/${token}`;

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "geoffrey.parker@ethereal.email",
          pass: "eDmqYq4mdPK3J27Z32",
        },
      });
      let info = await transporter.sendMail({
        from: '"Fred Foo " <mobarakali62@gmail.com>', // sender address
        to: "mobarakali62@gmail.com", // list of receivers
        subject: "Password Reset", // Subject line

        html: `<a href="${link}">Click Here</a> to reset your password`, // html body
      });

      res.status(200).send({ message: "please check email", link: link });
    } else {
      res.status(401).send({ message: "Email is not exists" });
    }
  } else {
    res.status(401).send({ message: "Email field is required" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { password, confirm_password } = req.body;
  const { id, token } = req.params;
  const user = await authUser.findOne({ id: id });

  // Genarate new token
  const secret = user.id + config.app.token_sectet;

  try {
    jwt.verify(token, secret);
    if (password && confirm_password) {
      if (password !== confirm_password) {
        res.status(401).send({ message: "Password not match" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({ message: "Password reset successfully" });
      }
    } else {
      res.status(401).send({ message: "All field are required" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const logedinUser = async (req, res) => {
  try {
    const user = await authUser
      .findOne({
        username: req.username,
        email: req.email,
      })
      .select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = {
  signup,
  login,
  changePassword,
  sendUserPasswordResetEmail,
  resetPassword,
  logedinUser,
};

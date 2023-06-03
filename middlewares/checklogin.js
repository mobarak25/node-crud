const jwt = require("jsonwebtoken");
const config = require("../config/config");

const checkLogin = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, config.app.token_sectet);
    const { username, email } = decodedToken;
    req.username = username;
    req.email = email;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = checkLogin;

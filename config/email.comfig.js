const nodemailer = require("nodemailer");
const config = require("./config");

let transporter = nodemailer.createTransport({
  host: config.email.email_host,
  port: config.email.email_port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.email_user, // Admin Gmail ID
    pass: config.email.email_pass, // Admin Gmail Password
  },
});

module.exports = transporter;

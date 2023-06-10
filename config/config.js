require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 4000,
    token_sectet: process.env.JWT_SECRET,
  },
  db: {
    url: process.env.DB_RRL,
  },
  email: {
    email_host: process.env.EMAIL_HOST,
    email_port: process.env.EMAIL_PORT,
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS,
    email_from: process.env.EMAIL_FROM,
  },
};

module.exports = dev;

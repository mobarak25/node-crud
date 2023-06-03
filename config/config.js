require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 4000,
    token_sectet: process.env.JWT_SECRET,
  },
  db: {
    url: process.env.DB_RRL,
  },
};

module.exports = dev;

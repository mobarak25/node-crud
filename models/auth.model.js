const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  password: {
    type: Number,
    require: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Auth", authSchema);

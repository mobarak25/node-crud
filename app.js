const express = require("express");
const cors = require("cors"); //Cross origin
const multer = require("multer");
const upload = multer();

require("./config/db");

const app = express();
app.use(cors());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // for parsing application/json

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
app.use("/api/users", userRouter);
app.use("/api/users", authRouter);

//api/users : GET
//api/users/:id : GET
//api/users/ : POST
//api/users/:id : PATCH
//api/users/:id : DELETE

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

// route not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

//handaling  server error
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something broke" });
});

module.exports = app;

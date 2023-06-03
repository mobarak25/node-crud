const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//get one user
const getOneUser = async (req, res) => {
  try {
    const getOneUser = await User.findOne({ id: req.body.id });
    res.status(200).json(getOneUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//create one user
const createUser = async (req, res) => {
  try {
    const newUser = new User({
      id: uuidv4(),
      name: req.body.name,
      age: Number(req.body.age),
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//Update one user
const UpdateUser = async (req, res) => {
  try {
    const findAndUpdatedUser = await User.findOne({ id: req.body.id });
    findAndUpdatedUser.name = req.body.name;
    findAndUpdatedUser.age = Number(req.body.age);
    await findAndUpdatedUser.save();
    res.status(200).json(findAndUpdatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//delete one user
const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ id: req.body.id });
    res.status(200).json({ message: "Delete User Successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  createUser,
  UpdateUser,
  deleteUser,
};

const users = require("express").Router();

const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
users.use(cors());

users.post("/register", async (req, res) => {
  const { name, password, email } = req.body;

  const newUser = {
    name,
    password,
    email,
    created_at: new Date()
  };

  try {
    const existingUser = await User.findOne({
      where: {
        email: newUser.email
      }
    });

    if (existingUser)
      return res.status(404).json({
        status: false,
        message: `${existingUser.name} you are already a member`
      });

    newUser.password = await bcrypt.hash(newUser.password, 3);

    await User.create(newUser).then(registerdUser => {
      res.status(200).json({
        status: true,
        message: `${registerdUser.name} You will be redirected to signin page`
      });
    });
  } catch (excption) {
    console.error(excption);
  }
});

users.post("/login", async (req, res) => {
  res.json({ Route: true });
});

users.get("/", async (req, res) => {
  User.findAll().then(data => {
    console.log(data.dataValues);
  });
});

module.exports = users;

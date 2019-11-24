require("dotenv").config();
const users = require("express").Router();

const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../models/user.model");
users.use(cors());

users.post(
  "/register",
  [
    check("username").isLength({ min: 4 }),
    check("password").isLength({ min: 4 })
  ],
  async (req, res) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const newUser = {
      username,
      password,
      created_at: new Date()
    };

    try {
      const existingUser = await User.findOne({
        where: {
          username: newUser.username
        }
      });

      if (existingUser)
        return res.status(404).json({
          status: false,
          message: `You are already a member`
        });

      newUser.password = await bcrypt.hash(newUser.password, 3);

      await User.create(newUser).then(registerdUser => {
        res.status(200).json({
          status: true,
          message: `Account has been sucessfully created`
        });
      });
    } catch (excption) {
      res.status(400).send(excption);
    }
  }
);

users.post(
  "/login",
  [
    check("username").isLength({ min: 4 }),
    check("password").isLength({ min: 3 })
  ],
  async (req, res) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    try {
      const existingUser = await User.findOne({
        where: {
          username
        }
      });

      if (!existingUser)
        return res
          .status(404)
          .json({ status: false, message: "User not registerd." });

      const passwordIsMatched = await bcrypt.compare(
        password,
        existingUser.dataValues.password
      );

      if (!passwordIsMatched)
        return res
          .status(404)
          .json({ status: false, message: "Incorrect Password" });

      let token = await jwt.sign(
        existingUser.dataValues,
        process.env.AUTH_SECRET,
        {
          expiresIn: 1440
        }
      );

      if (!token)
        return res.status(404).json({
          status: false,
          message: "Something wrong over the process."
        });

      res.json({ status: true, token });
    } catch (excption) {
      res.status(400).send(excption);
    }
  }
);

users.get("/", async (req, res) => {
  User.findAll().then(data => {
    console.log(data.dataValues);
  });
});

module.exports = users;

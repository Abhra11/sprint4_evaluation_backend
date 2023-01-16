const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/Users.model");
require("dotenv").config();

const userRoute = express();

userRoute.get("/", (req, res) => {
  res.send("All users");
});

userRoute.post("/register", (req, res) => {
  const { name, email, gender, password } = req.body;
  try {
    bcrypt.hash(password, 4, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({ email, password: hash, name, gender });
        await user.save();
        res.send("User Registered");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, process.env.key);
          res.send({ msg: "Login Succ", token: token });
        } else {
          console.log("Wrong Creds while generating token");
        }
      });
    }
  } catch (err) {
    console.log(err);
    console.log("Wrong Creds");
  }
});

module.exports = { userRoute };

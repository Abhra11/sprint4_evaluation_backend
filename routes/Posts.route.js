const express = require("express");
const { PostModel } = require("../models/Posts.model");
const { UserModel } = require("../models/Users.model");

const postRoute = express();
postRoute.use(express.json());

postRoute.get("/", async (req, res) => {
  const query = req.query;
  const posts = await PostModel.find(query);
  res.send(posts);
});

postRoute.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const post = new PostModel(payload);
    await post.save();
    res.send("Posts is Created");
  } catch (err) {
    console.log(err);
    console.log("Error while creating post");
  }
});

postRoute.patch("/update/:id", async (req, res) => {
  const ID = req.params.id;
  const payload = req.body;
  //   console.log(ID, payload);
  const post = await PostModel.findOne({ _id: ID });
  const userID_in_post = post.userID;
  const userID_in_req = req.body.userID;

  try {
    if (userID_in_req !== userID_in_post) {
      res.send({ msg: "You are not authorised" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: ID }, payload);
      res.send("Update Done");
    }
  } catch (err) {
    console.log(err);
  }
});

postRoute.delete("/delete/:id", async (req, res) => {
  const ID = req.params.id;

  //   console.log(ID, payload);
  const post = await PostModel.findOne({ _id: ID });
  const userID_in_post = post.userID;
  const userID_in_req = req.body.userID;

  try {
    if (userID_in_req !== userID_in_post) {
      res.send({ msg: "You are not authorised" });
    } else {
      await PostModel.findByIdAndDelete({ _id: ID });
      res.send("Delete Done");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = { postRoute };

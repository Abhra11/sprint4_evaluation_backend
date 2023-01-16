const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./configs/db");
const { userRoute } = require("./routes/Users.route");
const { postRoute } = require("./routes/Posts.route");
const { Authenticator } = require("./middlewares/Authenticator.middleware");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/users", userRoute);
app.use(Authenticator);
app.use("/posts", postRoute);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB connected");
  } catch (err) {
    console.log(err);
    console.log("Something went wrong while Connection");
  }

  console.log(`Port is Running on ${process.env.port}`);
});

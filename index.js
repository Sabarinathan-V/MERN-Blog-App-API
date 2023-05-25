// Express app
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "https://myblog-mern-fullstack-sabarinathan-v.netlify.app",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


// Database connection
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");

// JWT Authentication
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// File uploads
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const fs = require("fs");
const path = require("path");
require("dotenv").config();

// salt and secret key
const salt = bcrypt.genSaltSync(10);
const secret = "secretkey";

// mongodb connection
mongoose.connect(process.env.MONGODB_URI);

// static file directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ROUTES

// Route for user registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const UserDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(UserDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

// Route for user logged in
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

// Route for user verification
app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "JWT token not provided" });
  }
  
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

// Route for user logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Route to create a post
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const part = originalname.split(".");
  const ext = part[part.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

// Route to update a post
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const part = originalname.split(".");
    const ext = part[part.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const IsAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    if (!IsAuthor) {
      return res.status(400).json("you are not the author");
    }

    const updatedDoc = await Post.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      },
      { new: true }
    );

    res.json(updatedDoc);
  });
});

// Route to get all post data for homepage
app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

// Route to get a particular post using id
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);

  res.json(postDoc);
});

// connecting express app on a port
app.listen(process.env.PORT, (req, res) => {
  console.log(`express running on port ${process.env.PORT}`);
});

// Dependencies
const bcrypt = require("bcrypt");
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

userRouter.get("/login", (req, res) => {
  res.render("login.ejs");
});

userRouter.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

userRouter.get("/logout", (req, res) => {
  res.redirect("/");
});

// New (registration page)
userRouter.post("/", (req, res) => {
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  User.create(req.body, (error, createdUser) => {
    res.send(createdUser);
  });
});

// Create (registration route)

// Export User Router
module.exports = userRouter;

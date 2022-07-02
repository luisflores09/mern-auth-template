// Dependencies
const bcrypt = require("bcrypt");
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

userRouter.get("/login", async (req, res) => {
  try {
    res.render("login.ejs");
  } catch (error) {
    res.status(401).json({ message: `There has been an error` });
  }
});

userRouter.get("/signup", async (req, res) => {
  try {
    res.render("signup.ejs");
  } catch (error) {
    res.status(401).json({ message: `There has been an error` });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    //overwrite the user password with the hashed password, then pass that in to our database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    User.create(req.body);
    res.redirect('/users/login')
  } catch (error) {
    res.status(500).send(error);
  }
  console.log(req.body.password);
  console.log(req.body);
});

userRouter.get("/logout", (req, res) => {
  res.redirect("/");
});

// New (registration page)

// Create (registration route)

// Export User Router
module.exports = userRouter;

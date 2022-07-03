// Dependencies
const bcrypt = require("bcrypt");
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

// To create a user with encrypted password

// 1) Stub up a basic project boilerplate
// 2) Install the bcrypt library
// 3) Define the authentication workflow
//  3.1) Defina a signup route/controller to send the user to a registration form
//  3.2) Allow the user to fill out the form and submit it
//  3.3) Use bcrypt to hash the user plain text password from req.body
//  3.4) Save the user data to the data along with the hased version of their password
//  3.5) Redirect the user to the login page and make them login or auto log them in and send them to a dashboard

// To Login

// 1) Send the user to a login page
// 2) User fills out form with login credentials
// 3) User submits the form as a POST request to the server
// 4) We check to see if the user exists in the database by finding the user by their username
// 5) If the user does not exist, we need to let them know - 'Invalid Credentials'
// 6) If the user is found, we need to compare the plain text password submitted in the form to the hashed password
// 7) If the password is not a match, we need to let the user know - 'Invalid Credentials'
// 8) If the password is correct we need to create a session on the server by storing the users ObjectId in session storage

// To Logout

// 1) User clicks a logout button
// 2) we receive that request on the server side
// 3) req.session.destroy()

// Present user with login page
userRouter.get("/login", async (req, res) => {
  try {
    res.render("login.ejs", { error: "", user: req.session.user });
  } catch (error) {
    res.status(401).json({ message: `There has been an error` });
  }
});

// handle form submission
userRouter.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    const isMatched = bcrypt.compareSync(req.body.password, foundUser.password);
    if (!foundUser || !isMatched) {
      return res.render("login.ejs", { error: "Invalid Credentials", user: req.session.user });
    }
    req.session.user = foundUser._id;
    console.log(req.session);
    res.redirect("/users/dashboard");
  });
});

// present user with signup page
userRouter.get("/signup", async (req, res) => {
  try {
    res.render("signup.ejs", { user: req.session.user });
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
    res.redirect("/users/login");
  } catch (error) {
    res.status(500).send(error);
  }
  console.log(req.body.password);
  console.log(req.body);
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Protected Route
userRouter.get("/dashboard", isAuthenticated, (req, res) => {
  User.findById(req.session.user, (err, user) => {
    res.render("dashboard.ejs", { user });
  });
});

// Utility Functions

// Auth middleware
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/users/login", { user: req.session.user });
  }
  next();
}

// Export User Router
module.exports = userRouter;

const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  res.render("home.ejs");
});

module.exports = indexRouter;

const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  console.log(req.session);
  res.render("home.ejs", { user: req.session.user });
});

module.exports = indexRouter;

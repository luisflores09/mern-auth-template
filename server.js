// Dependencies
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const morgan = require("morgan");

// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useFindAndModify: false,
  //   useCreateIndex: true,
});

// Database Connection Error / Success
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is MongoDB not running?"));
db.on("connected", () => console.log("MongoDB Connected"));
db.on("disconnected", () => console.log("MongoDB Disconnected"));

// Middleware
// Body parser middleware: gives us access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSession({
  secret: process.env.SECRET, // this is used to digitally sign our session cookies (prevents forgery)
  resave: false, // this option updates session storage after request
  saveUninitialized: false
}));
app.use(morgan())

// Routes / Controllers
const userController = require("./controllers/users");
const indexController = require("./controllers/index");
app.use("/", indexController);
app.use("/users", userController);

// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is listening on Port: ${PORT}`));

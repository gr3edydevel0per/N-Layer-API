const express = require("express");
const morgan = require("morgan");
const db = require('./config/databaseHandler')
const config = require("./config/configHandler");

const app = express();

const userRoutes = require('./routes/userRoutes');
const gadgetRoutes = require('./routes/gadgetRoutes');
const errorHandler = require('./middleware/errorHandler')
// set the view engine to ejs
app.set("view engine", "ejs");


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Phoenix : IMF Gadget API API",
    version: "1.0.0",
    documentation: "/api/docs",
    login: "/api/login",
  });
});


app.get("/login", (req, res) => {
  res.render("landing",{action:"login"});
});


app.get("/register", (req, res) => {
  res.render("landing",{action:"register"});
});


app.use('/api/users', userRoutes);
app.use('/api/gadgets',gadgetRoutes);



app.use(errorHandler);
module.exports = app;
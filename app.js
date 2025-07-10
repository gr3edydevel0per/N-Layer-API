const express = require("express");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const db = require('./config/databaseHandler')
const config = require("./config/configHandler");
const swaggerSpec = require('./swaggerDef');

const app = express();

const userRoutes = require('./routes/userRoutes');
const gadgetRoutes = require('./routes/gadgetRoutes');
const errorHandler = require('./middleware/errorHandler')

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static("public"));

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Phoenix IMF Gadget API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// Serve raw OpenAPI spec as JSON
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Phoenix : IMF Gadget API API",
    version: "1.0.0",
    documentation: "/api/docs",
    openapi_spec: "/api/docs.json",
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
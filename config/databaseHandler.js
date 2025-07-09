const { Sequelize } = require('sequelize');
const config = require('./configHandler');


const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging ? logger.info : false,
    pool: config.database.pool
  }
);

// Import models
const User = require('../models/userModel')(sequelize);
const Gadget = require('../models/gadgetModel')(sequelize);

// Database object
const db = {
  sequelize,
  Sequelize,
  User,
  Gadget
};

module.exports = db;
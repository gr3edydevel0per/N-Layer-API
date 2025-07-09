const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error response
  let error = {
    success: false,
    message: 'Internal server error'
  };

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    error.message = 'Validation error';
    error.details = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json(error);
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    error.message = 'Resource already exists';
    error.details = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} must be unique`
    }));
    return res.status(409).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Custom application errors
  if (err.message.includes('not found')) {
    error.message = err.message;
    return res.status(404).json(error);
  }

  if (err.message.includes('already exists') || err.message.includes('Invalid credentials')) {
    error.message = err.message;
    return res.status(400).json(error);
  }

  // Default server error
  res.status(500).json(error);
};

module.exports = errorHandler;
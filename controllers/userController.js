const Joi = require('joi');
const userService = require('../services/userService');
const logger = require('../utils/logger');

class UserController {
  static registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  static updateSchema = Joi.object({
    email: Joi.string().email()
  });

  async register(req, res, next) {
    try {
      // Validate request body
      const { error, value } = UserController.registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      const result = await userService.registerUser(value);
      
      logger.info(`User registered successfully: ${result.user.email}`);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      // Validate request body
      const { error, value } = UserController.loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      const { email, password } = value;
      const result = await userService.loginUser(email, password);
      
      logger.info(`User logged in successfully: ${email}`);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      const tokens = await userService.refreshToken(refreshToken);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      // User is attached to req by auth middleware
      const user = req.user;
      
      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
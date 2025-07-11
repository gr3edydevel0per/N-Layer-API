/**
 * UserController
 * Handles user-related API endpoints: registration, authentication, and API token management.
 *
 * Endpoints:
 *   - POST   /api/users/register      : Register a new user.
 *   - POST   /api/users/login        : Login and return JWT access token.
 *   - POST   /api/users/generate-token : Generate/retrieve user's API token (authentication required).
 *
 * Validation: Joi
 * Logging: Winston
 * Error Handling: Centralized via middleware.
 */

const Joi = require('joi');
const userService = require('../services/userService');
const logger = require('../utils/logger');
const AuthUtils = require('../utils/authUtils');

class UserController {
  // Joi schemas for request validation
  static registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  /**
   * Register a new user.
   * @route POST /api/users/register
   */
  async register(req, res, next) {
    try {
      const { error, value } = UserController.registerSchema.validate(req.body);
      if (error)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(({ path, message }) => ({ field: path[0], message })),
        });

      const result = await userService.registerUser(value);
      logger.info(`User registered: ${result.user.email}`);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
        },
      });
    } catch (err) {
      if (err.message === 'User already exists with this email') {
        return res.status(409).json({
          success: false,
          message: err.message,
        });
      }
      next(err);
    }
  }

  /**
   * Login a user and return access token.
   * @route POST /api/users/login
   */
  async login(req, res, next) {
    try {
      const { error, value } = UserController.loginSchema.validate(req.body);
      if (error)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(({ path, message }) => ({ field: path[0], message })),
        });

      const { email, password } = value;
      const result = await userService.loginUser(email, password);

      logger.info(`User logged in: ${email}`);

      res.json({
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
        },
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
      });
    } catch (err) {
      if (err.message === 'Invalid credentials') {
        return res.status(401).json({
          success: false,
          message: err.message,
        });
      }
      next(err);
    }
  }

  /**
   * Generate/retrieve user's API token. User must be authenticated.
   * @route POST /api/users/generate-token
   */
  async generateToken(req, res, next) {
    try {
      // req.user is set by authentication middleware
      const { id, email } = req.user;
      const user = await userService.fetchUser(id);

      if (user.api_token) {
        return res.status(409).json({
          success: false,
          message: 'An API token has already been generated for this user. Please read the documentation if you need to regenerate it.',
        });
      }

      const apiToken = await userService.generateApiToken({ id, email });
      res.json({ apiToken });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
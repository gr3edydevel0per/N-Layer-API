const Joi = require('joi');
const userService = require('../services/userService');
const logger = require('../utils/logger');
const AuthUtils = require('../utils/authUtils');

class UserController {
  // JOI Schemas
  static registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  /**
   * Register a new user.
   * @route POST /api/users/register
   */
  async register(req, res, next) {
    try {
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
        message: 'User registered successfully',
        user: {
          id: result.user.id,
          email: result.user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login a user and return access token.
   * @route POST /api/users/login
   */
  async login(req, res, next) {
    try {
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
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
        },
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate and return user's API token. User must be authenticated.
   * @route POST /api/users/generate-token
   */
  async generateToken(req, res, next) {
    try {
      // req.user is set by authentication middleware
      const profileData = { id: req.user.id, email: req.user.email };
      const user = await userService.fetchUser(profileData.id);

      let apiToken;
      if (!user.api_token) {
        // Generate and save if not present
        apiToken = await userService.generateApiToken(profileData);
      } else {
        // If api_token already exists, you could choose to return it or enforce re-generation
        apiToken = "An API token has already been generated for this user. Please read the documentation if you need to regenerate it.";
      }

      res.json({
        "Api Token" : apiToken,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
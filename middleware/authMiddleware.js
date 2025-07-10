const logger = require('../utils/logger');
const AuthUtils = require('../utils/authUtils');
const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

/**
 * Middleware to validate short-lived JWT Access Tokens.
 * - Extracts the Bearer token from the Authorization header.
 * - Verifies the token using AuthUtils.verifyAccessToken.
 * - Attaches the decoded user info to req.user on success.
 * - Sends a 401 on invalid/expired token, 500 on other errors.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      const error = AuthUtils.createAuthErrorResponse('Access token required');
      return res.status(error.statusCode).json(error.response);
    }

    // Verify access token
    const decoded = await AuthUtils.verifyAccessToken(token);

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);

    const statusCode =
      error.message.includes('not found') ||
      error.message.includes('Invalid') ||
      error.message.includes('expired')
        ? 401
        : 500;

    const errorResponse = AuthUtils.createAuthErrorResponse(
      statusCode === 500 ? 'Internal server error' : error.message,
      statusCode
    );

    return res.status(errorResponse.statusCode).json(errorResponse.response);
  }
};

/**
 * Middleware to validate long-lived API tokens.
 * - Extracts the Bearer token from the Authorization header.
 * - Compares the hash of the first 8 chars of the token to all stored API token hashes in the DB.
 * - Attaches the matching user to req.user on success.
 * - Sends a 401 on invalid token, 500 on other errors.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const apiTokenValidator = async (req, res, next) => {
  try {
    // 1. Extract the token from header
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      const error = AuthUtils.createAuthErrorResponse('API token required');
      return res.status(error.statusCode).json(error.response);
    }

    const usersWithApiTokens = await userRepository.findAllWithApiToken();

    let matchedUser = null;
    for (const user of usersWithApiTokens) {
      if (user.api_token) {
        const isMatch = await bcrypt.compare(token, user.api_token);
        if (isMatch) {
          matchedUser = user;
          break;
        }
      }
    }

    if (!matchedUser) {
      const error = AuthUtils.createAuthErrorResponse('Invalid API token', 401);
      return res.status(error.statusCode).json(error.response);
    }

    // Attach user to request
    req.user = matchedUser;
    next();
  } catch (error) {
    logger.error('API Token Validator middleware error:', error);
    const errorResponse = AuthUtils.createAuthErrorResponse(
      'Internal server error',
      500
    );
    return res.status(errorResponse.statusCode).json(errorResponse.response);
  }
};

module.exports = {
  authMiddleware,
  apiTokenValidator,
};
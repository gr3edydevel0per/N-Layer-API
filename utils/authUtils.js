const jwt = require('jsonwebtoken');
const config = require('../config/configHandler');
const logger = require('./logger');

class AuthUtils {
  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} - Extracted token or null
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} - Decoded token payload
   * @throws {Error} - If token is invalid
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      logger.error('JWT verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT tokens (access + refresh)
   * @param {Object} user - User object
   * @returns {Object} - Object containing access and refresh tokens
   */
  static generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000)
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn
    };
  }

  /**
   * Verify refresh token
   * @param {string} refreshToken - Refresh token to verify
   * @returns {Object} - Decoded token payload
   * @throws {Error} - If token is invalid
   */
  static verifyRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (error) {
      logger.error('Refresh token verification failed:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  

  /**
   * Create standardized auth error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} - Standardized error response
   */
  static createAuthErrorResponse(message = 'Authentication failed', statusCode = 401) {
    return {
      statusCode,
      response: {
        success: false,
        message,
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = AuthUtils;
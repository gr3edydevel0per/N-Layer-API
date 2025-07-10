/**
 * AuthUtils - JWT Utility Class
 *
 * Handles secure token extraction, verification, generation (with cryptographically strong nonce),
 * and error formatting for authentication.
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/configHandler');
const logger = require('./logger');

class AuthUtils {
  /**
   * Extracts token from Authorization header.
   * @param {string} authHeader - Authorization header value.
   * @returns {string|null} Extracted token or null if not present.
   */
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  /**
   * Verifies JWT access token.
   * @param {string} token - JWT token to verify.
   * @returns {Object} Decoded token payload.
   * @throws {Error} if token is invalid or expired.
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
    } catch (error) {
      logger.error('JWT verification failed:', error);
      throw new Error('Invalid or expired token');
    }
  }



  /**
   * Generates cryptographically strong random nonce.
   * @param {number} length - Length of nonce in bytes.
   * @returns {string} Random nonce as hex string.
   */
  static generateNonce(length = 16) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generates a JWT access token with a secure nonce.
   * @param {Object} user - User object with id and email.
   * @returns {Object} Object containing accessToken, nonce, and expiry info.
   */
  static generateAccessToken(user) {
    const nonce = AuthUtils.generateNonce();
    const payload = {
      id: user.id,
      email: user.email,
      nonce,
      iat: Math.floor(Date.now() / 1000)
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      algorithm: 'HS256'
    });

    return {
      accessToken,
      expiresIn: config.jwt.expiresIn
    };
  }

  /**
   * Generates a JWT API token (using refresh secret) with a secure nonce.
   * @param {Object} user - User object with id and email.
   * @returns {Object} Object containing apiToken, nonce, and expiry info.
   */
  static generateApiToken(user) {
    const nonce = AuthUtils.generateNonce();
    const payload = {
      id: user.id,
      email: user.email,
      nonce,
      iat: Math.floor(Date.now() / 1000)
    };

    const apiToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      algorithm: 'HS256'
    });
    const hash = crypto.createHash('sha256').update(apiToken).digest('hex');
    return hash;
  }

  /**
   * Creates standardized auth error response.
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code.
   * @returns {Object} Standardized error response.
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
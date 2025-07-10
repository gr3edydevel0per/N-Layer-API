/**
 * UserService - Service layer for user-related business logic.
 *
 * Handles user registration, login, fetching, and API token management.
 */

const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/configHandler');
const logger = require('../utils/logger');
const AuthUtils = require('../utils/authUtils');
const bcrypt = require('bcrypt');

class UserService {
  /**
   * Registers a new user if the email is not already in use.
   * @param {Object} userData - User registration data (email, password, etc).
   * @returns {Promise<Object>} Registered user object.
   * @throws {Error} If user already exists or registration fails.
   */
  async registerUser(userData) {
    try {
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      const user = await userRepository.create(userData);
      return { user };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Authenticates a user and generates an access token on success.
   * @param {string} email - User email.
   * @param {string} password - Plain text password.
   * @returns {Promise<Object>} Authenticated user object and access token.
   * @throws {Error} If credentials are invalid or login fails.
   */
  async loginUser(email, password) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      await userRepository.update(user.id, { lastLogin: new Date() });
      const token = AuthUtils.generateAccessToken(user);
      return {
        user,
        ...token
      };
    } catch (error) {
      logger.error('Error logging in user:', error);
      throw error;
    }
  }

  /**
   * Fetches a user by ID.
   * @param {string} id - User ID.
   * @returns {Promise<Object>} User object.
   * @throws {Error} If user not found.
   */
  async fetchUser(id) {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        throw new Error('Invalid user id');
      }
      return user;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Generates and stores an API token for the user if not already present.
   * Hashes and saves the token in the database.
   * @param {Object} userData - Must contain at least { id, email }.
   * @returns {Promise<string>} The generated API token.
   * @throws {Error} If user not found or token generation fails.
   */
  async generateApiToken(userData) {
    try {
      const user = await userRepository.findById(userData.id);
      if (!user) {
        throw new Error('User not found');
      }
      // If already has a token, return it (optional: re-issue logic could go here)
      if (user.api_token) {
        throw new Error('You have already generated token once. Visit /renew to get a new tokens')
      }
      // Generate new API token
      const apiToken = AuthUtils.generateApiToken(userData);
      // Hash part of the token for storage
      const apiTokenHash = await bcrypt.hash(apiToken, 12);
      await userRepository.update(user.id, { api_token: apiTokenHash });
      return apiToken;
    } catch (error) {
      logger.error('Error generating API token:', error);
      throw new Error('Error while generating API token');
    }
  }
}

module.exports = new UserService();
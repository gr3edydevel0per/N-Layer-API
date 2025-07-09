const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/configHandler');
const logger = require('../utils/logger');

class UserService {
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const user = await userRepository.create(userData);
      
      // Generate tokens
      const tokens = this.generateTokens(user);
      
      return {
        user,
        ...tokens
      };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      // Find user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Validate password
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await userRepository.update(user.id, { lastLogin: new Date() });

      // Generate tokens
      const tokens = this.generateTokens(user);

      return {
        user,
        ...tokens
      };
    } catch (error) {
      logger.error('Error logging in user:', error);
      throw error;
    }
  }

  generateTokens(user) {
    const payload = {
      id: user.id,
      email: user.email
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });

    const api_token = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn
    });

    return {
      accessToken,
      api_token
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await userRepository.findById(decoded.id);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);
      return tokens;
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new UserService();
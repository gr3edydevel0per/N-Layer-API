/**
 * UserRepository
 * Provides data access methods for user entities using the configured DB handler.
 * Handles CRUD operations and API token queries with robust logging.
 */

const { Op } = require('sequelize');
const db = require('../config/databaseHandler');
const logger = require('../utils/logger');

class UserRepository {
  /**
   * Create a new user in the database.
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    try {
      const user = await db.User.create(userData);
      logger.info(`User created with ID: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find a user by primary key (ID).
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    try {
      return await db.User.findByPk(id);
    } catch (error) {
      logger.error(`Error finding user by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a user by email.
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    try {
      return await db.User.findOne({ where: { email } });
    } catch (error) {
      logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Update user by ID.
   * @param {number|string} id
   * @param {Object} updateData
   * @returns {Promise<Object|null>}
   */
  async update(id, updateData) {
    try {
      const [updatedRowsCount] = await db.User.update(updateData, { where: { id } });
      if (!updatedRowsCount) return null;
      logger.info(`User updated with ID: ${id}`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete user by ID.
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    try {
      const deletedRowsCount = await db.User.destroy({ where: { id } });
      logger.info(`User deleted with ID: ${id}`);
      return deletedRowsCount > 0;
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find all users with a non-null API token.
   * @returns {Promise<Array<Object>>}
   */
  async findAllWithApiToken() {
    try {
      return await db.User.findAll({ where: { api_token: { [Op.ne]: null } } });
    } catch (error) {
      logger.error('Error fetching users with API token:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
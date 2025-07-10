const { Op } = require('sequelize');
const db = require('../config/databaseHandler');
const logger = require('../utils/logger');

class UserRepository {
  /**
   * Create a new user in the database.
   * @param {Object} userData
   * @returns {Promise<Object>} The created user instance.
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
   * Find a user by their primary key (ID).
   * @param {number|string} id
   * @returns {Promise<Object|null>} The user instance or null.
   */
  async findById(id) {
    try {
      const user = await db.User.findByPk(id);
      return user;
    } catch (error) {
      logger.error(`Error finding user by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a user by email.
   * @param {string} email
   * @returns {Promise<Object|null>} The user instance or null.
   */
  async findByEmail(email) {
    try {
      const user = await db.User.findOne({ where: { email } });
      return user;
    } catch (error) {
      logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Update a user by ID.
   * @param {number|string} id
   * @param {Object} updateData
   * @returns {Promise<Object|null>} The updated user instance or null.
   */
  async update(id, updateData) {
    try {
      const [updatedRowsCount] = await db.User.update(updateData, {
        where: { id }
      });
      if (updatedRowsCount === 0) {
        return null;
      }
      const updatedUser = await this.findById(id);
      logger.info(`User updated with ID: ${id}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user by ID.
   * @param {number|string} id
   * @returns {Promise<boolean>} Whether the user was deleted.
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
   * Find all users who have a non-null API token.
   * @returns {Promise<Array<Object>>} Array of user instances.
   */
  async findAllWithApiToken() {
    try {
      const users = await db.User.findAll({
        where: { api_token: { [Op.ne]: null } }
      });
      return users;
    } catch (error) {
      logger.error('Error fetching users with API token:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
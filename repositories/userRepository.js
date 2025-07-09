const db = require('../config/databaseHandler');
const logger = require('../utils/logger');

class UserRepository {
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

  async findById(id) {
    try {
      const user = await db.User.findByPk(id);
      return user;
    } catch (error) {
      logger.error(`Error finding user by ID ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = await db.User.findOne({ where: { email } });
      return user;
    } catch (error) {
      logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRowsCount] = await db.User.update(updateData, {
        where: { id },
        returning: true
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

  async findAll(options = {}) {
    try {const db = require('../config/database');
const logger = require('../utils/logger');

class UserRepository {
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

  async findById(id) {
    try {
      const user = await db.User.findByPk(id);
      return user;
    } catch (error) {
      logger.error(`Error finding user by ID ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = await db.User.findOne({ where: { email } });
      return user;
    } catch (error) {
      logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRowsCount] = await db.User.update(updateData, {
        where: { id },
        returning: true
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

  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, where = {} } = options;
      const offset = (page - 1) * limit;
      
      const result = await db.User.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      return {
        users: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page
      };
    } catch (error) {
      logger.error('Error finding users:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
      const { page = 1, limit = 10, where = {} } = options;
      const offset = (page - 1) * limit;
      
      const result = await db.User.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
      
      return {
        users: result.rows,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page
      };
    } catch (error) {
      logger.error('Error finding users:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
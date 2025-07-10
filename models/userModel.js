/**
 * User Model Definition
 * 
 * Represents a user entity with authentication and audit fields.
 * Passwords are securely hashed before storage.
 * 
 * @module models/userModel
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

/**
 * Defines the User model.
 * @param {Sequelize} sequelize - The sequelize instance.
 * @returns {Model} User model.
 */
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    api_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      /**
       * Hash password before saving a new user.
       */
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      /**
       * Hash password if it's changed during update.
       */
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  /**
   * Validate given password against stored hash.
   * @param {string} password - Raw password to validate.
   * @returns {Promise<boolean>}
   */
  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  /**
   * Removes sensitive fields from the JSON output.
   * @returns {Object}
   */
  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
    return values;
  };

  return User;
};
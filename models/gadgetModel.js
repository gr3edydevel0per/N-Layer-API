/**
 * Gadget Model Definition
 *
 * Represents a gadget with a unique ID, name, status, and optional decommissioned date.
 * Custom toJSON method provides a summarized info string based on status.
 *
 * @module models/gadgetModel
 */

const { DataTypes } = require('sequelize');
const GadgetUtils = require('../utils/gadgetUtils');

/**
 * Defines the Gadget model.
 * @param {Sequelize} sequelize - The sequelize instance.
 * @returns {Model} Gadget model.
 */
module.exports = (sequelize) => {
  const Gadget = sequelize.define('Gadget', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    status: {
      type: DataTypes.ENUM('Available', 'Deployed', 'Destroyed', 'Decommissioned'),
      defaultValue: 'Available',
    },
    decommissionedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'gadgets',
    timestamps: true,
  });

  /**
   * Customizes the JSON output of the Gadget model instance.
   * - For "Destroyed" status: returns destruction info.
   * - For "Decommissioned" status: includes decommissioned date.
   * - For others: includes a random success probability.
   * @returns {{id: string, info: string}}
   */
  Gadget.prototype.toJSON = function () {
    const { id, name, status, decommissionedAt } = this.get();

    if (status === 'Destroyed') {
      return {
        id,
        info: `${name} is destroyed`,
      };
    }

    if (status === 'Decommissioned') {
      const dateText = decommissionedAt
        ? new Date(decommissionedAt).toDateString()
        : 'unknown date';
      return {
        id,
        info: `${name} was decommissioned at ${dateText}`,
      };
    }

    // For "Available" or "Deployed"
    const probability = GadgetUtils.generateSuccessProbability();
    return {
      id,
      info: `${name} - ${probability}% success probability`,
    };
  };

  return Gadget;
};
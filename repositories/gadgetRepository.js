/**
 * GadgetRepository
 * Provides data access methods for gadget entities using the configured DB handler.
 * Handles queries, updates, and status management with robust logging.
 */

const db = require("../config/databaseHandler");
const logger = require("../utils/logger");

class GadgetRepository {
  /**
   * Create a new gadget record.
   * @param {Object} gadgetData
   * @returns {Promise<Object>}
   */
  async create(gadgetData) {
    try {
      const gadget = await db.Gadget.create(gadgetData);
      logger.info(`Gadget created with ID: ${gadget.id}`);
      return gadget;
    } catch (error) {
      logger.error("Error creating gadget:", error);
      throw error;
    }
  }

  /**
   * Find a gadget by primary key.
   * @param {string|number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    try {
      return await db.Gadget.findByPk(id);
    } catch (error) {
      logger.error(`Error finding gadget by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a gadget by its name.
   * @param {string} gadgetName
   * @returns {Promise<Object|null>}
   */
  async findByName(gadgetName) {
    try {
      return await db.Gadget.findOne({ where: { name: gadgetName } });
    } catch (error) {
      logger.error(`Error finding gadget by name ${gadgetName}:`, error);
      throw error;
    }
  }

  /**
   * Update gadget by ID.
   * @param {string|number} id
   * @param {Object} updateData
   * @returns {Promise<Object|null>}
   */
  async update(id, updateData) {
    try {
      const [updatedRowsCount] = await db.Gadget.update(updateData, { where: { id } });
      if (!updatedRowsCount) {
        logger.warn(`No gadget found to update with ID: ${id}`);
        return null;
      }
      logger.info(`Gadget updated with ID: ${id}`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating gadget ${id}:`, error);
      throw error;
    }
  }

  /**
   * Soft-delete (decommission) gadget by name.
   * @param {string} gadgetName
   * @returns {Promise<boolean>}
   */
  async delete(gadgetName) {
    try {
      const [updatedRowsCount] = await db.Gadget.update(
        { status: "Decommissioned", decommissionedAt: new Date() },
        { where: { name: gadgetName } }
      );
      if (!updatedRowsCount) {
        logger.warn(`No gadget found to decommission with name: ${gadgetName}`);
        return false;
      }
      logger.info(`Gadget marked as Decommissioned with name: ${gadgetName}`);
      return true;
    } catch (error) {
      logger.error(`Error decommissioning gadget ${gadgetName}:`, error);
      throw error;
    }
  }

  /**
   * Patch gadget properties by ID.
   * @param {Object} gadgetData
   * @returns {Promise<Object|null>}
   */
  async patch(gadgetData) {
    try {
      const { id, name, status } = gadgetData;
      if (!id) throw new Error("Gadget ID is required for patching.");

      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (status !== undefined) updateFields.status = status;
      if (status === "Decommissioned") updateFields.decommissionedAt = new Date();
      else if (status !== undefined) updateFields.decommissionedAt = null;

      if (!Object.keys(updateFields).length) {
        logger.warn(`No data provided for patching gadget with ID: ${id}`);
        return null;
      }

      const [updatedRowsCount] = await db.Gadget.update(updateFields, { where: { id } });
      if (!updatedRowsCount) {
        logger.warn(`No gadget found to update with ID: ${id}`);
        return null;
      }
      logger.info(`Gadget patched. ID: ${id}`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error patching gadget with ID: ${gadgetData.id}`, error);
      throw error;
    }
  }

  /**
   * Fetch all gadgets.
   * @returns {Promise<Array>}
   */
  async fetchAll() {
    try {
      return await db.Gadget.findAll();
    } catch (error) {
      logger.error("Error fetching all gadgets:", error);
      throw error;
    }
  }

  /**
   * Fetch all gadgets with specific status.
   * @param {string} gadgetStatus
   * @returns {Promise<Array>}
   */
  async fetchAllStatus(gadgetStatus) {
    try {
      return await db.Gadget.findAll({ where: { status: gadgetStatus } });
    } catch (error) {
      logger.error(`Error fetching all gadgets with status ${gadgetStatus}`, error);
      throw error;
    }
  }

  /**
   * Update status of a gadget by ID.
   * @param {string|number} id
   * @param {string} status
   * @returns {Promise<Object|null|{message:string, gadget:Object}>}
   */
  async updateStatus(id, status) {
    try {
      const gadget = await this.findById(id);
      if (!gadget) {
        logger.warn(`No gadget found to update status with ID: ${id}`);
        return null;
      }
      if (gadget.status === "Destroyed") {
        logger.info(`Gadget with ID: ${id} is already destroyed.`);
        return { message: "Gadget is already destroyed", gadget };
      }
      const [updatedRowsCount] = await db.Gadget.update({ status }, { where: { id } });
      if (!updatedRowsCount) {
        logger.warn(`No gadget found to update status with ID: ${id}`);
        return null;
      }
      logger.info(`Gadget status updated. ID: ${id}, Status: ${status}`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating gadget status with ID: ${id}`, error);
      throw error;
    }
  }
}

module.exports = new GadgetRepository();
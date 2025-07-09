const db = require("../config/databaseHandler");
const logger = require("../utils/logger");

class GadgetRepository {
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

  async findById(id) {
    try {
      const gadget = await db.Gadget.findByPk(id);
      return gadget;
    } catch (error) {
      logger.error(`Error finding gadget by ID ${id}:`, error);
      throw error;
    }
  }

async findByName(gadgetName) {
  try {
    const gadget = await db.Gadget.findOne({ where: { name: gadgetName } });
    return gadget;
  } catch (error) {
    logger.error(`Error finding gadget by name ${gadgetName}:`, error);
    throw error;
  }
}

  async update(id, updateData) {
    try {
      const [updatedRowsCount] = await db.Gadget.update(updateData, {
        where: { id },
        returning: true,
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      const updatedGadget = await this.findById(id);
      logger.info(`Gadget updated with ID: ${id}`);
      return updatedGadget;
    } catch (error) {
      logger.error(`Error updating gadget ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const [updatedRowsCount] = await db.Gadget.update(
        { status: "Decommissioned" },
        { where: { id } }
      );

      if (updatedRowsCount === 0) {
        logger.warn(`No gadget found to decommission with ID: ${id}`);
        return false;
      }

      logger.info(`Gadget marked as Decommissioned with ID: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error decommissioning gadget ${id}:`, error);
      throw error;
    }
  }

  async fetchAll() {
    try {
      const allGadgets = await db.Gadget.findAll();
      return allGadgets;
    } catch (error) {
      logger.error("Error fetching all gadgets:", error);
      throw error;
    }
  }
}

module.exports = new GadgetRepository();

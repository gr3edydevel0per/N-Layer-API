/**
 * GadgetService
 * Handles business logic for gadget management: registration, inventory queries,
 * status updates, decommission, and self-destruct.
 */

const logger = require('../utils/logger');
const gadgetRepository = require('../repositories/gadgetRepository');

class GadgetService {
  /**
   * Register a new gadget if it doesn't already exist.
   * @param {Object} gadgetData
   * @returns {Object} Newly created gadget
   */
  async registerGadget(gadgetData) {
    try {
      const existingGadget = await gadgetRepository.findByName(gadgetData.name);
      if (existingGadget) throw new Error('Gadget already exists with this name');
      return await gadgetRepository.create(gadgetData);
    } catch (error) {
      logger.error('Error registering gadget:', error);
      throw error;
    }
  }

  /**
   * Fetch all gadgets from the inventory.
   * @returns {Array|String} Array of gadgets or inventory message
   */
  async fetchAllGadgets() {
    try {
      const gadgets = await gadgetRepository.fetchAll();
      return gadgets && gadgets.length ? gadgets : 'Inventory is empty';
    } catch (error) {
      logger.error('Error getting gadgets:', error);
      throw error;
    }
  }

  /**
   * Fetch all gadgets filtered by status.
   * @param {String} status
   * @returns {Array|String} Array of gadgets or status message
   */
  async fetchAllWithStatus(status) {
    try {
      const gadgets = await gadgetRepository.fetchAllStatus(status);
      return gadgets && gadgets.length ? gadgets : 'No gadget with such status';
    } catch (error) {
      logger.error('Error getting gadgets:', error);
      throw error;
    }
  }

  /**
   * Decommission (soft-delete) a gadget by name.
   * @param {Object} gadgetData
   * @returns {Boolean} Decommission status
   */
  async delete(gadgetData) {
    try {
      return await gadgetRepository.delete(gadgetData.name);
    } catch (error) {
      logger.error('Error deleting gadget:', error);
      throw error;
    }
  }

  /**
   * Patch gadget properties.
   * @param {Object} gadgetData
   * @returns {Object|null} Updated gadget or null
   */
  async patch(gadgetData) {
    try {
      return await gadgetRepository.patch(gadgetData);
    } catch (error) {
      logger.error('Error updating gadget:', error);
      throw error;
    }
  }

  /**
   * Trigger self-destruct sequence for a gadget.
   * @param {String} id
   * @param {String} confirmationCode
   * @returns {Object|null} Updated gadget with confirmation code
   */
  async selfDestruct(id, confirmationCode) {
    try {
      const updatedGadget = await gadgetRepository.updateStatus(id, 'Destroyed');
      if (!updatedGadget) {
        logger.warn(`No gadget found to self-destruct with ID: ${id}`);
        return null;
      }
      return { ...updatedGadget, confirmationCode };
    } catch (error) {
      logger.error('Error triggering self-destruct:', error);
      throw error;
    }
  }
}

module.exports = new GadgetService();
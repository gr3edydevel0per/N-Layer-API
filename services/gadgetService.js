const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/configHandler');
const logger = require('../utils/logger');
const gadgetRepository = require('../repositories/gadgetRepository');
const { deleteGadget } = require('../controllers/gadgetController');

class GadgetService {
  async registerGadget(gadgetData) {
    try {
      // Check if gadget already exists
      const existingGadget = await gadgetRepository.findByName(gadgetData.name);
      if (existingGadget) {
        throw new Error('gadget already exists with this name');
      }

      // Create new gadget
      const gadget = await gadgetRepository.create(gadgetData);

      return {
        gadget
      };
    } catch (error) {
      logger.error('Error registering gadget:', error);
      throw error;
    }
  }

  async fetchAllGadgets(){
 try {
      // Check if gadget already exists
      const gadgets = await gadgetRepository.fetchAll()
      if (gadgets.length===0) {
        return 'inventory is empty';
      }
      return {
        gadgets
      };
    } catch (error) {
      logger.error('Error getting gadgets:', error);
      throw error;
    }
  }


  async fetchAllWithStatus(status){
 try {
      // Check if gadget already exists
      const gadgets = await gadgetRepository.fetchAllStatus(status)
      if (gadgets.length===0) {
        return 'No Gadget with such status';
      }
      return {
        gadgets
      };
    } catch (error) {
      logger.error('Error getting gadgets:', error);
      throw error;
    }
  }


  async delete(gadgetData){
    try{
      const decommissionGadget = await gadgetRepository.delete(gadgetData.name)
      return decommissionGadget;
    }
    catch(error){
      logger.error('Error deleting gadget',error);
      throw error
    }

  }



  generateTokens(gadget) {
    const payload = {
      id: gadget.id,
      email: gadget.email
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
      const gadget = await userRepository.findById(decoded.id);
      
      if (!gadget || !gadget.isActive) {
        throw new Error('Invalid refresh token');
      }

      const tokens = this.generateTokens(gadget);
      return tokens;
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new GadgetService();
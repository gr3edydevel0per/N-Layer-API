const Joi = require('joi');
const gadgetService = require('../services/gadgetService');
const logger = require('../utils/logger');
const GadgetUtils = require('../utils/gadgetUtils');

class GadgetController {
  static registerSchema = Joi.object({
    name: Joi.string().required()
  });

  static updateSchema = Joi.object({
    name: Joi.string(),
    status: Joi.string().valid("Available", "Deployed", "Destroyed", "Decommissioned"),
  });

  async registerGadget(req, res, next) {
    try {
      const gadgetName = GadgetUtils.generateGadgetName();
      const { error, value } = GadgetController.registerSchema.validate({ name: gadgetName });
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      const result = await gadgetService.registerGadget(value);
      logger.info(`Gadget registered successfully: ${result.name}`);

      res.status(201).json({
        success: true,
        message: 'Gadget registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchGadgets(req, res, next) {
    try {
      const gadgets = await gadgetService.fetchAllGadgets();
      res.json({
        data:gadgets
      });

    } catch (error) {
      next(error);
    }
  }

  async updateGadget(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = GadgetController.updateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      const result = await gadgetService.updateGadget(id, value);
      logger.info(`Gadget updated successfully: ${id}`);

      res.json({
        success: true,
        message: 'Gadget updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GadgetController();
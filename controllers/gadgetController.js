const Joi = require('joi');
const gadgetService = require('../services/gadgetService');
const logger = require('../utils/logger');
const GadgetUtils = require('../utils/gadgetUtils');

class GadgetController {
  // JOI Schemas for validation
  static fetchSchema = Joi.object({
    status: Joi.string().valid("Available", "Deployed", "Destroyed", "Decommissioned").optional()
  });

  static registerSchema = Joi.object({
    name: Joi.string().required()
  });

  static deleteSchema = Joi.object({
    name: Joi.string().required()
  });

  /**
   * Register a new gadget with a generated unique name.
   * @route POST /api/gadgets/register
   */
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

  /**
   * Fetch gadgets, optionally filtered by status.
   * @route GET /api/gadgets
   */
  async fetchGadgets(req, res, next) {
    try {
      const { error, value } = GadgetController.fetchSchema.validate(req.query);
      if (error) {
        logger.warn(`Gadget fetch validation failed: ${error.details[0].message}`);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      let gadgets;
      if (value.status) {
        gadgets = await gadgetService.fetchAllWithStatus(value.status);
      } else {
        gadgets = await gadgetService.fetchAllGadgets();
      }

      res.json({
        success: true,
        data: gadgets
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Decommission (soft-delete) a gadget by name.
   * @route DELETE /api/gadgets
   */
  async deleteGadget(req, res, next) {
    try {
      const { error, value } = GadgetController.deleteSchema.validate(req.body);
      if (error) {
        logger.warn(`Gadget delete validation failed: ${error.details[0].message}`);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      const decommissioned = await gadgetService.delete(value.name);
      logger.info(`Gadget decommissioned: ${value.name}`);
      res.json({
        success: true,
        message: decommissioned
          ? `Gadget '${value.name}' decommissioned successfully.`
          : `No gadget found with the name '${value.name}'.`,
        decommissioned
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GadgetController();
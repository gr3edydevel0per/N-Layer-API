/**
 * GadgetController
 * Handles all gadget-related API endpoints: validation, delegation to business logic, and logging.
 *
 * Endpoints:
 *   - POST   /api/gadgets/register : Register a new gadget (unique name generated).
 *   - GET    /api/gadgets         : Fetch gadgets, optionally filtered by status.
 *   - DELETE /api/gadgets         : Decommission (soft-delete) a gadget by name.
 *   - PATCH  /api/gadgets         : Update gadget properties (name, status).
 *   - POST   /api/gadgets/:id/self-destruct : Trigger self-destruct for a gadget.
 *
 * Validation: Joi
 * Logging: Winston
 * Error Handling: Centralized via middleware.
 */

const Joi = require('joi');
const gadgetService = require('../services/gadgetService');
const logger = require('../utils/logger');
const GadgetUtils = require('../utils/gadgetUtils');

class GadgetController {
  // Joi schemas for validation
  static fetchSchema = Joi.object({
    status: Joi.string().valid('Available', 'Deployed', 'Destroyed', 'Decommissioned').optional(),
  });

  static registerSchema = Joi.object({
    name: Joi.string().required(),
  });

  static deleteSchema = Joi.object({
    name: Joi.string().required(),
  });

  static patchSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().optional(),
    status: Joi.string().valid('Available', 'Deployed', 'Destroyed', 'Decommissioned').optional(),
  });

  /**
   * Register a new gadget (unique name generated).
   * @route POST /api/gadgets/register
   */
  async registerGadget(req, res, next) {
    try {
      const name = GadgetUtils.generateGadgetName();
      const { error, value } = GadgetController.registerSchema.validate({ name });
      if (error)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(({ path, message }) => ({ field: path[0], message })),
        });

      const result = await gadgetService.registerGadget(value);
      logger.info(`Gadget registered: ${result.name}`);
      res.status(201).json({
        success: true,
        message: 'Gadget registered successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch gadgets, optionally filtered by status.
   * @route GET /api/gadgets
   */
  async fetchGadgets(req, res, next) {
    try {
      const { error, value } = GadgetController.fetchSchema.validate(req.query);
      if (error)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(({ path, message }) => ({ field: path[0], message })),
        });

      const gadgets = value.status
        ? await gadgetService.fetchAllWithStatus(value.status)
        : await gadgetService.fetchAllGadgets();

      res.json({ success: true, data: gadgets });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Decommission (soft-delete) a gadget by name.
   * @route DELETE /api/gadgets
   */
  async deleteGadget(req, res, next) {
    try {
      const { error, value } = GadgetController.deleteSchema.validate(req.body);
      if (error)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(({ path, message }) => ({ field: path[0], message })),
        });

      const decommissioned = await gadgetService.delete(value);
      logger.info(`Gadget decommissioned: ${value.name}`);
      res.json({
        success: true,
        message: decommissioned
          ? `Gadget '${value.name}' decommissioned successfully.`
          : `No gadget found with the name '${value.name}'.`,
        decommissioned,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update gadget properties (name, status) by id.
   * @route PATCH /api/gadgets
   */
  async patchGadget(req, res, next) {
    try {
      const { error, value } = GadgetController.patchSchema.validate(req.body);
      if (error)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(({ path, message }) => ({ field: path[0], message })),
        });

      if (!value.name && !value.status)
        return res.status(400).json({
          success: false,
          message: 'No data provided for update. At least one of "name" or "status" must be specified.',
          details: [],
        });

      const updated = await gadgetService.patch(value);
      logger.info(`Gadget updated: ${value.id}`);
      res.json({
        success: !!updated,
        message: updated
          ? `Gadget '${value.id}' updated successfully.`
          : `No gadget found with id '${value.id}'.`,
        data: updated || null,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Trigger self-destruct sequence for a gadget.
   * @route POST /api/gadgets/:id/self-destruct
   */
  async selfDestructGadget(req, res, next) {
    try {
      const { error, value } = Joi.object({ id: Joi.string().required() }).validate(req.params);
      if (error)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map(({ path, message }) => ({ field: path[0], message })),
        });

      const confirmationCode = GadgetUtils.generateConfirmationCode();
      const result = await gadgetService.selfDestruct(value.id, confirmationCode);

      if (result && result.message === 'Gadget is already destroyed')
        return res.status(409).json({
          success: false,
          message: result.message,
          data: result.gadget,
        });

      if (!result)
        return res.status(404).json({
          success: false,
          message: `No gadget found with ID: ${value.id}.`,
        });

      logger.info(`Self-destruct triggered for gadget ID: ${value.id}`);
      res.status(200).json({
        success: true,
        message: `Self-destruct sequence initiated for Gadget ID: ${value.id}.`,
        confirmationCode,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GadgetController();
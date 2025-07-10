/**
 * @swagger
 * tags:
 *   name: Gadgets
 *   description: IMF gadget management operations
 */

const express = require('express');
const gadgetController = require('../controllers/gadgetController');
const { apiTokenValidator } = require('../middleware/authMiddleware');

const router = express.Router();

// Use API Token Validator middleware for all gadget routes
router.use(apiTokenValidator);

/**
 * @swagger
 * /api/gadgets:
 *   get:
 *     summary: Fetch all gadgets or filter by status
 *     tags: [Gadgets]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Deployed, Destroyed, Decommissioned]
 *         description: Filter gadgets by status
 *         example: Available
 *     responses:
 *       200:
 *         description: List of gadgets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Invalid status parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - API token required
 *       403:
 *         description: Forbidden - Invalid API token
 */
router.get('/', gadgetController.fetchGadgets);

/**
 * @swagger
 * /api/gadgets:
 *   post:
 *     summary: Register a new gadget with auto-generated name
 *     tags: [Gadgets]
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       201:
 *         description: Gadget registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Gadget registered successfully
 *                 data:
 *                   $ref: '#/components/schemas/Gadget'
 *       401:
 *         description: Unauthorized - API token required
 *       403:
 *         description: Forbidden - Invalid API token
 *       500:
 *         description: Internal server error
 */
router.post('/', gadgetController.registerGadget);

/**
 * @swagger
 * /api/gadgets:
 *   delete:
 *     summary: Decommission (soft-delete) a gadget by name
 *     tags: [Gadgets]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the gadget to decommission
 *                 example: Invisibility Cloak MK-7
 *     responses:
 *       200:
 *         description: Gadget decommissioned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Gadget 'Invisibility Cloak MK-7' decommissioned successfully.
 *                 decommissioned:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Validation error - name required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - API token required
 *       403:
 *         description: Forbidden - Invalid API token
 *       404:
 *         description: Gadget not found
 */
router.delete('/', gadgetController.deleteGadget);

module.exports = router;
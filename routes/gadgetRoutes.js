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

// Apply API Token Validator middleware to all gadget routes
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

/**
 * @swagger
 * /api/gadgets:
 *   patch:
 *     summary: Update gadget properties (name, status)
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
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: Gadget ID
 *               name:
 *                 type: string
 *                 description: New name for the gadget
 *               status:
 *                 type: string
 *                 enum: [Available, Deployed, Destroyed, Decommissioned]
 *                 description: New status for the gadget
 *     responses:
 *       200:
 *         description: Gadget updated successfully
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
 *                   example: Gadget '123' updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Gadget'
 *       400:
 *         description: Validation error
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
router.patch('/', gadgetController.patchGadget);

/**
 * @swagger
 * /api/gadgets/{id}/self-destruct:
 *   post:
 *     summary: Trigger self-destruct sequence for a gadget
 *     tags: [Gadgets]
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gadget ID to self-destruct
 *     responses:
 *       200:
 *         description: Self-destruct sequence initiated
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
 *                   example: Self-destruct sequence initiated for Gadget ID 123.
 *                 confirmationCode:
 *                   type: string
 *                   example: XJ-9912
 *       400:
 *         description: Validation error
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
 *       409:
 *         description: Gadget already destroyed
 */
router.post('/:id/self-destruct', gadgetController.selfDestructGadget);

module.exports = router;
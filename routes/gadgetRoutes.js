const express = require('express');
const gadgetController = require('../controllers/gadgetController');
const { apiTokenValidator } = require('../middleware/authMiddleware');

const router = express.Router();

// Use API Token Validator middleware for all gadget routes
router.use(apiTokenValidator);

router.get('/', gadgetController.fetchGadgets);
router.post('/', gadgetController.registerGadget);
router.delete('/', gadgetController.deleteGadget);

module.exports = router;
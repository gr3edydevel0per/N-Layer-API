

const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const gadgetController = require('../controllers/gadgetController');
// const { authLimiter, generalLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Public routes (with auth rate limiting)
router.use(authMiddleware)
router.get('/',gadgetController.fetchGadgets);
router.post('/',gadgetController.registerGadget);
router.post('/refresh-token',userController.refreshToken);



module.exports = router;
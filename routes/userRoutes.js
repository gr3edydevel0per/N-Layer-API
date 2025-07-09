

const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
// const { authLimiter, generalLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Public routes (with auth rate limiting)
router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/refresh-token',userController.refreshToken);

router.use(authMiddleware)
router.get('/profile',userController.getProfile)
module.exports = router;
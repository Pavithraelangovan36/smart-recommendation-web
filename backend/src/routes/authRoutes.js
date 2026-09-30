const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/demo-user', authController.demoUserLogin);
router.post('/demo-admin', authController.demoAdminLogin);
router.get('/me', authenticateToken, authController.getMe);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/interests', authenticateToken, authController.updateInterests);

module.exports = router;

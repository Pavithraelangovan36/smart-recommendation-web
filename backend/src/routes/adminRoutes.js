const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// All routes under /api/admin require admin authentication
router.use(authenticateToken, requireAdmin);

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/analytics/charts', adminController.getAnalyticsCharts);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.get('/settings/algorithm', adminController.getAlgorithmSettings);
router.put('/settings/algorithm', adminController.updateAlgorithmSettings);
router.post('/settings/reset-seeds', adminController.resetDatabase);

module.exports = router;

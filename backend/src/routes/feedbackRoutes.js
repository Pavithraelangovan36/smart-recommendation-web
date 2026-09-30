const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { optionalAuth, authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, feedbackController.submitFeedback);
router.get('/', feedbackController.getFeedbackList);
router.patch('/:id/status', authenticateToken, requireAdmin, feedbackController.updateStatus);

module.exports = router;

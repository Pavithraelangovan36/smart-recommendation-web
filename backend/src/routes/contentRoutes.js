const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { optionalAuth, authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', contentController.getContentList);
router.get('/:id', optionalAuth, contentController.getContentById);

// Admin operations
router.post('/', authenticateToken, requireAdmin, contentController.createContent);
router.put('/:id', authenticateToken, requireAdmin, contentController.updateContent);
router.delete('/:id', authenticateToken, requireAdmin, contentController.deleteContent);

module.exports = router;
